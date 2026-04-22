<template>
  <div class="q-mb-md">
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
        color="teal-700"
        text-color="white"
        icon="smart_toy"
      />
      <div
        class="ai-chat-bubble ai-chat-bubble--assistant bg-gray-0 text-dark q-pa-sm"
      >
        <div v-if="message.status === 'thinking'">
          {{ message.content }}
        </div>
        <div v-else class="ai-chat-markdown" v-html="message.renderedHtml" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
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
  margin: 0;
}

.ai-chat-markdown :deep(p + p) {
  margin-top: 8px;
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
</style>
