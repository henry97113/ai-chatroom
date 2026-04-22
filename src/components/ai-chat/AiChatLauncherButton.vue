<template>
  <q-btn
    rounded
    no-caps
    color="orange-400"
    text-color="white"
    class="q-px-md q-py-xs shadow-8"
    @click="$emit('open')"
  >
    <q-icon left size="16px" name="fa-solid fa-wand-magic-sparkles" />
    <span>Ask Nitra AI</span>
  </q-btn>
</template>

<script setup>
defineEmits(["open"]);
</script>
