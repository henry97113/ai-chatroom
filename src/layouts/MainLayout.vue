<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <AiChatWidget />
  </q-layout>
</template>

<script setup>
import AiChatWidget from "components/AiChatWidget.vue";
</script>
