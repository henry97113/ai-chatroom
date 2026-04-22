<template>
  <q-card-section style="padding: 20px 16px">
    <div class="row items-center no-wrap q-gutter-sm">
      <q-input
        :model-value="modelValue"
        class="col"
        dense
        borderless
        placeholder="Say something..."
        :disable="isResponding"
        @update:model-value="$emit('update:modelValue', $event)"
        @keydown.enter.exact.prevent="$emit('send')"
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
        class="ai-chat-send-button"
        size="md"
        icon="arrow_forward"
        color="teal-700"
        text-color="white"
        aria-label="Send message"
        :loading="isResponding"
        :disable="!canSend"
        @click="$emit('send')"
      />
    </div>
  </q-card-section>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  isResponding: {
    type: Boolean,
    required: true,
  },
  canSend: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["update:modelValue", "send"]);
</script>

<style scoped>
.ai-chat-send-button {
  width: 36px;
  height: 36px;
  min-height: unset;
  min-width: unset;
}
</style>
