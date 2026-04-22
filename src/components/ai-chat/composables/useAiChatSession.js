import { computed, ref } from "vue";
import MarkdownIt from "markdown-it";

import { getMockAssistantResponse } from "src/services/aiChatService";

import {
  RESPONSE_DELAY_MAX,
  RESPONSE_DELAY_MIN,
  STREAM_CHUNK_MAX,
  STREAM_CHUNK_MIN,
  STREAM_STEP_DELAY,
  WELCOME_MESSAGE_TEXT,
} from "../chatConstants";
import {
  getRandomInteger,
  sleep,
  splitSuggestedQuestionContent,
} from "../chatUtils";

const markdownRenderer = new MarkdownIt({
  breaks: true,
  linkify: true,
});

export function useAiChatSession({ scrollToBottom }) {
  const isResponding = ref(false);
  const draftMessage = ref("");
  const messages = ref([]);

  let messageSequence = 1;

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

    addUserMessage(prompt);
    await scrollToBottom(true);

    isResponding.value = true;
    const assistantMessageId = addAssistantThinkingMessage();
    await scrollToBottom();

    try {
      const response = await getMockAssistantResponse(prompt);
      const responseDelay = getRandomInteger(RESPONSE_DELAY_MIN, RESPONSE_DELAY_MAX);
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

  return {
    isResponding,
    draftMessage,
    messages,
    canSend,
    hasUserMessage,
    hasWelcomeGreetingMessage,
    addAssistantMessage,
    sendMessage,
  };
}
