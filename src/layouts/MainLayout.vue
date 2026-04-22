<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <AiChatWidget />
  </q-layout>
</template>

<script setup>
import AiChatWidget from 'components/AiChatWidget.vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Home',
    caption: 'Home',
    icon: 'home',
    to: '/'
  },
  {
    title: 'Colors',
    caption: 'Color palette and utilities',
    icon: 'palette',
    to: '/colors'
  },
  {
    title: 'Typography',
    caption: 'Typography',
    icon: 'text_fields',
    to: '/typography'
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    target: '_blank',
    href: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    target: '_blank',
    href: 'https://github.com/quasarframework'
  },
]
</script>
