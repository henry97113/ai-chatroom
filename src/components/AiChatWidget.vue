<template>
  <div class="ai-chat-widget">
    <q-card v-show="isOpen" class="ai-chat-panel column no-wrap">
      <q-card-section class="bg-teal-10 text-white" style="padding: 18px 20px">
        <div class="row items-start justify-between no-wrap">
          <div class="column">
            <div class="row items-center q-gutter-md">
              <q-icon name="auto_awesome" size="22px" />
              <div class="ai-chat-title text-weight-bold">Nitra AI</div>
              <q-icon name="fa-solid fa-wand-magic-sparkles" size="24px" />
            </div>
            <div class="text-body1 q-mt-xs">Hi there, How can we help?</div>
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
        class="col ai-chat-messages"
        @scroll="onMessagesScroll"
      >
        <div v-for="message in messages" :key="message.id" class="q-mb-md">
          <div v-if="message.role === 'user'" class="row justify-end">
            <div
              class="ai-chat-bubble ai-chat-bubble--user bg-teal-100 text-dark q-pa-sm"
            >
              {{ message.content }}
            </div>
          </div>

          <div v-else class="row items-start no-wrap q-gutter-sm">
            <q-avatar
              size="26px"
              color="teal-10"
              text-color="white"
              icon="smart_toy"
            />
            <div
              class="ai-chat-bubble ai-chat-bubble--assistant bg-gray-0 text-dark q-pa-sm"
            >
              <div v-if="message.status === 'thinking'">
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

        <div
          v-if="showIdleSuggestion"
          class="ai-chat-idle-suggestion"
        >
          <Transition name="idle-suggestion-slide" mode="out-in">
            <div
              :key="currentIdleSuggestion.text"
              class="ai-chat-idle-suggestion-inner row items-center no-wrap q-gutter-sm"
            >
              <q-icon :name="currentIdleSuggestion.icon" color="teal-4" size="16px" />
              <span class="ai-chat-idle-suggestion-text">{{ currentIdleSuggestion.text }}</span>
            </div>
          </Transition>
        </div>
      </div>

      <q-separator />

      <q-card-section style="padding: 20px 16px">
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
            color="gray-600"
            aria-label="Attach file"
            disable
          />

          <q-btn
            round
            style="
              width: 36px;
              height: 36px;
              min-height: unset;
              min-width: unset;
            "
            size="md"
            icon="arrow_forward"
            color="teal-700"
            text-color="white"
            aria-label="Send message"
            :loading="isResponding"
            :disable="!canSend"
            @click="sendMessage"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-btn
      rounded
      no-caps
      color="orange-400"
      text-color="white"
      class="q-px-md q-py-xs shadow-8"
      @click="openChatroom"
    >
      <q-icon left size="16px" name="fa-solid fa-wand-magic-sparkles" />
      <span>Ask Nitra AI</span>
    </q-btn>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import MarkdownIt from "markdown-it";

import { getMockAssistantResponse } from "src/services/aiChatService";

const markdownRenderer = new MarkdownIt({
  breaks: true,
  linkify: true,
});

const SCROLL_BOTTOM_THRESHOLD = 20;
const RESPONSE_DELAY_MIN = 500;
const RESPONSE_DELAY_MAX = 1500;
const STREAM_CHUNK_MIN = 6;
const STREAM_CHUNK_MAX = 14;
const STREAM_STEP_DELAY = 18;
const WELCOME_MESSAGE_DELAY_MS = 500;
const WELCOME_MESSAGE_TEXT = "Welcome to Nitra AI!";
const IDLE_SUGGESTION_ROTATE_MS = 2000;
const IDLE_SUGGESTIONS = [
  { text: "Upload your supplier list", icon: "fa-solid fa-list" },
  { text: "Check if Avastin is in stock", icon: "fa-solid fa-cart-shopping" },
  {
    text: "Check if there's a better price for Xeomin",
    icon: "fa-solid fa-hand-holding-dollar",
  },
  {
    text: "What are some generic options for Restylane",
    icon: "fa-solid fa-magnifying-glass",
  },
  { text: "What's the best product for Xeomin", icon: "fa-solid fa-thumbs-up" },
];

const isOpen = ref(false);
const isResponding = ref(false);
const shouldAutoScroll = ref(true);
const draftMessage = ref("");
const messages = ref([]);
const messagesContainerRef = ref(null);
const idleSuggestionIndex = ref(0);

let messageSequence = 1;
let welcomeGreetingTimeoutId = null;
let idleCarouselIntervalId = null;

const canSend = computed(() => {
  return draftMessage.value.trim().length > 0 && !isResponding.value;
});

const hasUserMessage = computed(() => {
  return messages.value.some((message) => message.role === "user");
});

const hasWelcomeGreetingMessage = computed(() => {
  return messages.value.some(
    (message) =>
      message.role === "assistant" && message.content === WELCOME_MESSAGE_TEXT,
  );
});

const showIdleSuggestion = computed(() => {
  return isOpen.value && !hasUserMessage.value && IDLE_SUGGESTIONS.length > 0;
});

const currentIdleSuggestion = computed(() => {
  return (
    IDLE_SUGGESTIONS[idleSuggestionIndex.value] ?? {
      text: "",
      icon: "fa-solid fa-list",
    }
  );
});

function createMessage({ role, content, status = "done" }) {
  return {
    id: `message-${Date.now()}-${messageSequence++}`,
    role,
    content,
    renderedHtml:
      role === "assistant" && status !== "thinking"
        ? markdownRenderer.render(content)
        : "",
    status,
    createdAt: new Date().toISOString(),
  };
}

function closeChatroom() {
  clearWelcomeGreetingTimeout();
  stopIdleSuggestionCarousel();
  isOpen.value = false;
}

async function openChatroom() {
  isOpen.value = true;
  shouldAutoScroll.value = true;
  await scrollToBottom(true);

  if (!hasUserMessage.value) {
    startIdleSuggestionCarousel();
    scheduleWelcomeGreeting();
    return;
  }

  clearWelcomeGreetingTimeout();
  stopIdleSuggestionCarousel();
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isNearBottom(element) {
  if (!element) {
    return true;
  }

  return (
    element.scrollTop + element.clientHeight >=
    element.scrollHeight - SCROLL_BOTTOM_THRESHOLD
  );
}

function onMessagesScroll(event) {
  shouldAutoScroll.value = isNearBottom(event.target);
}

async function scrollToBottom(force = false) {
  await nextTick();

  const element = messagesContainerRef.value;
  if (!element) {
    return;
  }

  if (!force && !shouldAutoScroll.value) {
    return;
  }

  element.scrollTop = element.scrollHeight;
}

function addUserMessage(content) {
  messages.value.push(
    createMessage({
      role: "user",
      content,
    }),
  );
}

function addAssistantMessage(content) {
  messages.value.push(
    createMessage({
      role: "assistant",
      content,
    }),
  );
}

function addAssistantStreamingMessage() {
  const streamingMessage = createMessage({
    role: "assistant",
    content: "",
    status: "streaming",
  });

  messages.value.push(streamingMessage);
  return streamingMessage.id;
}

function clearWelcomeGreetingTimeout() {
  if (welcomeGreetingTimeoutId === null) {
    return;
  }

  clearTimeout(welcomeGreetingTimeoutId);
  welcomeGreetingTimeoutId = null;
}

function stopIdleSuggestionCarousel() {
  if (idleCarouselIntervalId === null) {
    return;
  }

  clearInterval(idleCarouselIntervalId);
  idleCarouselIntervalId = null;
}

function startIdleSuggestionCarousel() {
  stopIdleSuggestionCarousel();
  idleSuggestionIndex.value = 0;

  if (hasUserMessage.value || IDLE_SUGGESTIONS.length <= 1) {
    return;
  }

  idleCarouselIntervalId = setInterval(() => {
    if (hasUserMessage.value) {
      stopIdleSuggestionCarousel();
      return;
    }

    idleSuggestionIndex.value =
      (idleSuggestionIndex.value + 1) % IDLE_SUGGESTIONS.length;
  }, IDLE_SUGGESTION_ROTATE_MS);
}

function scheduleWelcomeGreeting() {
  clearWelcomeGreetingTimeout();

  if (hasUserMessage.value || hasWelcomeGreetingMessage.value) {
    return;
  }

  welcomeGreetingTimeoutId = setTimeout(() => {
    welcomeGreetingTimeoutId = null;

    if (hasUserMessage.value || hasWelcomeGreetingMessage.value || !isOpen.value) {
      return;
    }

    addAssistantMessage(WELCOME_MESSAGE_TEXT);
    scrollToBottom(true);
  }, WELCOME_MESSAGE_DELAY_MS);
}

function addAssistantThinkingMessage() {
  const thinkingMessage = createMessage({
    role: "assistant",
    content: "thinking...",
    status: "thinking",
  });

  messages.value.push(thinkingMessage);
  return thinkingMessage.id;
}

function getMessageById(messageId) {
  return messages.value.find((message) => message.id === messageId);
}

function removeMessageById(messageId) {
  const messageIndex = messages.value.findIndex((message) => message.id === messageId);
  if (messageIndex === -1) {
    return;
  }

  messages.value.splice(messageIndex, 1);
}

function splitSuggestedQuestionContent(fullContent) {
  const marker = "Suggested Question:";
  const markerIndex = fullContent.indexOf(marker);

  if (markerIndex === -1) {
    return {
      mainContent: fullContent,
      suggestedQuestionContent: "",
    };
  }

  const mainContent = fullContent.slice(0, markerIndex).trimEnd();
  const suggestedQuestionBody = fullContent
    .slice(markerIndex + marker.length)
    .trim();

  return {
    mainContent,
    suggestedQuestionContent: suggestedQuestionBody.length > 0
      ? `${marker} ${suggestedQuestionBody}`
      : marker,
  };
}

async function streamAssistantResponse(messageId, fullContent) {
  const message = getMessageById(messageId);
  if (!message) {
    return;
  }

  message.status = "streaming";
  message.content = "";
  message.renderedHtml = "";

  let index = 0;
  while (index < fullContent.length) {
    const chunkSize = getRandomInteger(STREAM_CHUNK_MIN, STREAM_CHUNK_MAX);
    index = Math.min(fullContent.length, index + chunkSize);

    message.content = fullContent.slice(0, index);
    message.renderedHtml = markdownRenderer.render(message.content);

    await scrollToBottom();
    await sleep(STREAM_STEP_DELAY);
  }

  message.status = "done";
  message.content = fullContent;
  message.renderedHtml = markdownRenderer.render(fullContent);

  await scrollToBottom();
}

async function sendMessage() {
  if (!canSend.value) {
    return;
  }

  const prompt = draftMessage.value.trim();
  draftMessage.value = "";

  clearWelcomeGreetingTimeout();
  stopIdleSuggestionCarousel();
  addUserMessage(prompt);
  shouldAutoScroll.value = true;
  await scrollToBottom(true);

  isResponding.value = true;
  const assistantMessageId = addAssistantThinkingMessage();
  await scrollToBottom();

  try {
    const response = await getMockAssistantResponse(prompt);
    const responseDelay = getRandomInteger(
      RESPONSE_DELAY_MIN,
      RESPONSE_DELAY_MAX,
    );
    await sleep(responseDelay);

    const { mainContent, suggestedQuestionContent } = splitSuggestedQuestionContent(
      response.content,
    );

    if (mainContent.trim().length > 0) {
      await streamAssistantResponse(assistantMessageId, mainContent);
    } else {
      removeMessageById(assistantMessageId);
    }

    if (suggestedQuestionContent.length > 0) {
      const suggestedQuestionMessageId = addAssistantStreamingMessage();
      await scrollToBottom();
      await streamAssistantResponse(
        suggestedQuestionMessageId,
        suggestedQuestionContent,
      );
      await scrollToBottom();
    }
  } finally {
    isResponding.value = false;
  }
}

onBeforeUnmount(() => {
  clearWelcomeGreetingTimeout();
  stopIdleSuggestionCarousel();
});
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

.ai-chat-title {
  font-size: 30px;
}

.ai-chat-messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 32px 20px;
}

.ai-chat-bubble {
  max-width: min(92%, 560px);
  line-height: 1.45;
}

.ai-chat-bubble--user {
  font-size: 16px;
  line-height: 1.3;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.ai-chat-bubble--assistant {
  font-size: 16px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
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

.ai-chat-idle-suggestion {
  margin-top: auto;
  align-self: flex-start;
  border: 1px solid #d6e5e5;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 10px 12px;
  overflow: hidden;
}

.ai-chat-idle-suggestion-inner {
  min-height: 22px;
}

.ai-chat-idle-suggestion-text {
  color: #5e7074;
  font-size: 16px;
}

.idle-suggestion-slide-enter-active,
.idle-suggestion-slide-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.idle-suggestion-slide-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.idle-suggestion-slide-leave-to {
  opacity: 0;
  transform: translateY(-14px);
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

  .ai-chat-idle-suggestion-text {
    font-size: 14px;
  }
}
</style>
