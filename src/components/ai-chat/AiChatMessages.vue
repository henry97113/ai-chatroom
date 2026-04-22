<template>
  <div
    ref="messagesContainerRef"
    class="col ai-chat-messages"
    @scroll="$emit('scroll', $event)"
  >
    <AiChatMessageItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />

    <div v-if="showIdleSuggestion" class="ai-chat-idle-suggestion">
      <Transition name="idle-suggestion-slide" mode="out-in">
        <div
          :key="currentIdleSuggestion.text"
          class="ai-chat-idle-suggestion-inner row items-center no-wrap q-gutter-sm"
        >
          <q-icon
            :name="currentIdleSuggestion.icon"
            color="teal-300"
            size="16px"
          />
          <span class="ai-chat-idle-suggestion-text text-gray-700 text-body2">{{
            currentIdleSuggestion.text
          }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import AiChatMessageItem from "./AiChatMessageItem.vue";

defineProps({
  messages: {
    type: Array,
    required: true,
  },
  showIdleSuggestion: {
    type: Boolean,
    required: true,
  },
  currentIdleSuggestion: {
    type: Object,
    required: true,
  },
});

defineEmits(["scroll"]);

const messagesContainerRef = ref(null);

function getContainerElement() {
  return messagesContainerRef.value;
}

defineExpose({
  getContainerElement,
});
</script>

<style scoped>
.ai-chat-messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 32px 20px;
}

.ai-chat-idle-suggestion {
  margin-top: auto;
  align-self: flex-start;
  background-color: #ffffff;
  padding: 10px 12px;
  overflow: hidden;
}

.ai-chat-idle-suggestion-inner {
  min-height: 22px;
}

.idle-suggestion-slide-enter-active,
.idle-suggestion-slide-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
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
  .ai-chat-idle-suggestion-text {
    font-size: 14px;
  }
}
</style>
