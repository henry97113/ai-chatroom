import { computed, ref } from "vue";

import {
  IDLE_SUGGESTION_ROTATE_MS,
  IDLE_SUGGESTIONS,
  WELCOME_MESSAGE_DELAY_MS,
  WELCOME_MESSAGE_TEXT,
} from "../chatConstants";

export function useIdleSuggestionCarousel({
  isOpen,
  hasUserMessage,
  hasWelcomeGreetingMessage,
  addAssistantMessage,
  scrollToBottom,
}) {
  const idleSuggestionIndex = ref(0);

  let welcomeGreetingTimeoutId = null;
  let idleCarouselIntervalId = null;

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

  function handleChatOpened() {
    if (!hasUserMessage.value) {
      startIdleSuggestionCarousel();
      scheduleWelcomeGreeting();
      return;
    }

    clearWelcomeGreetingTimeout();
    stopIdleSuggestionCarousel();
  }

  function handleBeforeUserMessageSent() {
    clearWelcomeGreetingTimeout();
    stopIdleSuggestionCarousel();
  }

  function cleanup() {
    clearWelcomeGreetingTimeout();
    stopIdleSuggestionCarousel();
  }

  return {
    showIdleSuggestion,
    currentIdleSuggestion,
    handleChatOpened,
    handleBeforeUserMessageSent,
    cleanup,
  };
}
