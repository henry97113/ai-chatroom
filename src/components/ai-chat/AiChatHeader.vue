<template>
  <q-card-section class="bg-teal-700 text-white" style="padding: 18px 20px">
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
        @click="$emit('close')"
      />
    </div>
  </q-card-section>
</template>

<script setup>
defineEmits(["close"]);
</script>

<style scoped>
.ai-chat-title {
  font-size: 30px;
}
</style>
