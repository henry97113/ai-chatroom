<template>
  <div class="ai-chat-widget">
    <q-card
      v-show="isOpen"
      flat
      bordered
      class="ai-chat-panel column no-wrap"
    >
      <q-card-section class="bg-teal-10 text-white q-px-lg q-py-md">
        <div class="row items-start justify-between no-wrap">
          <div class="column">
            <div class="row items-center q-gutter-sm">
              <q-icon
                name="auto_awesome"
                size="22px"
              />
              <div class="text-h6 text-weight-bold">
                Nitra AI
              </div>
            </div>
            <div class="text-body2 q-mt-xs">
              Hi there, How can we help?
            </div>
          </div>
          <q-btn
            flat
            dense
            round
            color="white"
            icon="close"
            aria-label="Close chatroom"
            @click="closeChatroom"
          />
        </div>
      </q-card-section>

      <div
        ref="messagesContainerRef"
        class="col q-pa-md ai-chat-messages"
        @scroll="onMessagesScroll"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="q-mb-md"
        >
          <div
            v-if="message.role === 'user'"
            class="row justify-end"
          >
            <div class="ai-chat-bubble ai-chat-bubble--user bg-teal-2 text-dark q-pa-sm rounded-borders">
              {{ message.content }}
            </div>
          </div>

          <div
            v-else
            class="row items-start no-wrap q-gutter-sm"
          >
            <q-avatar
              size="26px"
              color="teal-10"
              text-color="white"
              icon="smart_toy"
            />
            <div class="ai-chat-bubble ai-chat-bubble--assistant bg-grey-2 text-dark q-pa-sm rounded-borders">
              <div
                v-if="message.status === 'thinking'"
                class="text-grey-7 text-italic"
              >
                {{ message.content }}
              </div>
              <div
                v-else
                class="ai-chat-markdown"
                v-html="message.renderedHtml"
              />
            </div>
          </div>
        </div>
      </div>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <div class="row items-center no-wrap q-gutter-sm">
          <q-input
            v-model="draftMessage"
            class="col"
            dense
            borderless
            placeholder="Say something..."
            :disable="isResponding"
            @keydown.enter.exact.prevent="sendMessage"
          />

          <q-btn
            flat
            round
            dense
            icon="attach_file"
            color="grey-6"
            aria-label="Attach file"
            disable
          />

          <q-btn
            round
            unelevated
            icon="arrow_forward"
            color="teal-8"
            text-color="white"
            aria-label="Send message"
            :disable="!canSend"
            @click="sendMessage"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-btn
      unelevated
      rounded
      color="orange-6"
      text-color="white"
      icon="auto_awesome"
      class="q-px-md q-py-xs shadow-8"
      label="Ask Nitra AI"
      @click="openChatroom"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import MarkdownIt from 'markdown-it'

import { getMockAssistantResponse } from 'src/services/aiChatService'

const markdownRenderer = new MarkdownIt({
  breaks: true,
  linkify: true,
})

const SCROLL_BOTTOM_THRESHOLD = 20
const RESPONSE_DELAY_MIN = 500
const RESPONSE_DELAY_MAX = 1500
const STREAM_CHUNK_MIN = 6
const STREAM_CHUNK_MAX = 14
const STREAM_STEP_DELAY = 18

const isOpen = ref(false)
const isResponding = ref(false)
const shouldAutoScroll = ref(true)
const draftMessage = ref('')
const messages = ref([])
const messagesContainerRef = ref(null)

let messageSequence = 1

const canSend = computed(() => {
  return draftMessage.value.trim().length > 0 && !isResponding.value
})

function createMessage({ role, content, status = 'done' }) {
  return {
    id: `message-${Date.now()}-${messageSequence++}`,
    role,
    content,
    renderedHtml: role === 'assistant' && status !== 'thinking'
      ? markdownRenderer.render(content)
      : '',
    status,
    createdAt: new Date().toISOString(),
  }
}

function closeChatroom() {
  isOpen.value = false
}

async function openChatroom() {
  isOpen.value = true
  shouldAutoScroll.value = true
  await scrollToBottom(true)
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function isNearBottom(element) {
  if (!element) {
    return true
  }

  return element.scrollTop + element.clientHeight >= element.scrollHeight - SCROLL_BOTTOM_THRESHOLD
}

function onMessagesScroll(event) {
  shouldAutoScroll.value = isNearBottom(event.target)
}

async function scrollToBottom(force = false) {
  await nextTick()

  const element = messagesContainerRef.value
  if (!element) {
    return
  }

  if (!force && !shouldAutoScroll.value) {
    return
  }

  element.scrollTop = element.scrollHeight
}

function addUserMessage(content) {
  messages.value.push(createMessage({
    role: 'user',
    content,
  }))
}

function addAssistantThinkingMessage() {
  const thinkingMessage = createMessage({
    role: 'assistant',
    content: 'thinking...',
    status: 'thinking',
  })

  messages.value.push(thinkingMessage)
  return thinkingMessage.id
}

function getMessageById(messageId) {
  return messages.value.find((message) => message.id === messageId)
}

async function streamAssistantResponse(messageId, fullContent) {
  const message = getMessageById(messageId)
  if (!message) {
    return
  }

  message.status = 'streaming'
  message.content = ''
  message.renderedHtml = ''

  let index = 0
  while (index < fullContent.length) {
    const chunkSize = getRandomInteger(STREAM_CHUNK_MIN, STREAM_CHUNK_MAX)
    index = Math.min(fullContent.length, index + chunkSize)

    message.content = fullContent.slice(0, index)
    message.renderedHtml = markdownRenderer.render(message.content)

    await scrollToBottom()
    await sleep(STREAM_STEP_DELAY)
  }

  message.status = 'done'
  message.content = fullContent
  message.renderedHtml = markdownRenderer.render(fullContent)

  await scrollToBottom()
}

async function sendMessage() {
  if (!canSend.value) {
    return
  }

  const prompt = draftMessage.value.trim()
  draftMessage.value = ''

  addUserMessage(prompt)
  shouldAutoScroll.value = true
  await scrollToBottom(true)

  isResponding.value = true
  const assistantMessageId = addAssistantThinkingMessage()
  await scrollToBottom()

  try {
    const response = await getMockAssistantResponse(prompt)
    const responseDelay = getRandomInteger(RESPONSE_DELAY_MIN, RESPONSE_DELAY_MAX)
    await sleep(responseDelay)
    await streamAssistantResponse(assistantMessageId, response.content)
  } finally {
    isResponding.value = false
  }
}
</script>

<style scoped>
.ai-chat-widget {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 3200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.ai-chat-panel {
  width: min(640px, calc(100vw - 32px));
  height: min(860px, calc(100vh - 110px));
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(11, 40, 40, 0.18);
  overflow: hidden;
}

.ai-chat-messages {
  overflow-y: auto;
  background-color: #f5f5f5;
}

.ai-chat-bubble {
  max-width: min(92%, 560px);
  line-height: 1.45;
}

.ai-chat-bubble--user {
  font-size: 16px;
  line-height: 1.3;
}

.ai-chat-bubble--assistant {
  font-size: 16px;
}

.ai-chat-markdown :deep(p) {
  margin: 0 0 8px;
}

.ai-chat-markdown :deep(ol),
.ai-chat-markdown :deep(ul) {
  margin: 0 0 10px;
  padding-left: 22px;
}

.ai-chat-markdown :deep(li) {
  margin-bottom: 2px;
}

.ai-chat-markdown :deep(a) {
  color: #f97316;
}

.ai-chat-markdown :deep(strong) {
  font-weight: 700;
}

@media (max-width: 900px) {
  .ai-chat-widget {
    right: 12px;
    left: 12px;
    bottom: 12px;
    align-items: stretch;
  }

  .ai-chat-panel {
    width: 100%;
    height: min(78vh, 720px);
  }
}
</style>
