<template>
  <div class="ai-chat-widget">
    <Transition name="ai-chat-panel-fade">
      <q-card v-show="isOpen" class="ai-chat-panel column no-wrap">
        <AiChatHeader @close="closeChatroom" />

        <AiChatMessages
          ref="messagesViewRef"
          :messages="messages"
          :show-idle-suggestion="showIdleSuggestion"
          :current-idle-suggestion="currentIdleSuggestion"
          @scroll="onMessagesScroll"
        />

        <q-separator />

        <AiChatComposer
          v-model="draftMessage"
          :is-responding="isResponding"
          :can-send="canSend"
          @send="sendMessage"
        />
      </q-card>
    </Transition>

    <AiChatLauncherButton @open="openChatroom" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref } from "vue";

import AiChatComposer from "./ai-chat/AiChatComposer.vue";
import AiChatHeader from "./ai-chat/AiChatHeader.vue";
import AiChatLauncherButton from "./ai-chat/AiChatLauncherButton.vue";
import AiChatMessages from "./ai-chat/AiChatMessages.vue";
import { SCROLL_BOTTOM_THRESHOLD } from "./ai-chat/chatConstants";
import { useAiChatSession } from "./ai-chat/composables/useAiChatSession";
import { useIdleSuggestionCarousel } from "./ai-chat/composables/useIdleSuggestionCarousel";

const isOpen = ref(false);
const shouldAutoScroll = ref(true);
const messagesViewRef = ref(null);

function getMessagesContainerElement() {
  return messagesViewRef.value?.getContainerElement?.() ?? null;
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

  const element = getMessagesContainerElement();
  if (!element) {
    return;
  }

  if (!force && !shouldAutoScroll.value) {
    return;
  }

  element.scrollTop = element.scrollHeight;
}

const {
  isResponding,
  draftMessage,
  messages,
  canSend,
  hasUserMessage,
  hasWelcomeGreetingMessage,
  addAssistantMessage,
  sendMessage: sendChatMessage,
} = useAiChatSession({
  scrollToBottom,
});

const {
  showIdleSuggestion,
  currentIdleSuggestion,
  handleChatOpened,
  handleBeforeUserMessageSent,
  cleanup: cleanupIdleSuggestionTimers,
} = useIdleSuggestionCarousel({
  isOpen,
  hasUserMessage,
  hasWelcomeGreetingMessage,
  addAssistantMessage,
  scrollToBottom,
});

function closeChatroom() {
  cleanupIdleSuggestionTimers();
  isOpen.value = false;
}

async function openChatroom() {
  isOpen.value = true;
  shouldAutoScroll.value = true;
  await scrollToBottom(true);
  handleChatOpened();
}

async function sendMessage() {
  if (!canSend.value) {
    return;
  }

  handleBeforeUserMessageSent();
  shouldAutoScroll.value = true;
  await sendChatMessage();
}

onBeforeUnmount(() => {
  cleanupIdleSuggestionTimers();
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

.ai-chat-panel-fade-enter-active,
.ai-chat-panel-fade-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
  transform-origin: bottom right;
}

.ai-chat-panel-fade-enter-from,
.ai-chat-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
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
