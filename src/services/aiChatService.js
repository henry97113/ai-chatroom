import { MESSAGE_MOCK_MAP } from 'src/mock/messages'

const SUPPORTED_PROMPTS = Object.keys(MESSAGE_MOCK_MAP)

export async function getMockAssistantResponse(userPrompt) {
  const normalizedPrompt = userPrompt.trim()
  const matchedMessage = MESSAGE_MOCK_MAP[normalizedPrompt]?.message

  if (matchedMessage?.content) {
    return {
      matched: true,
      content: matchedMessage.content,
      supportedPrompts: SUPPORTED_PROMPTS,
    }
  }

  const suggestions = SUPPORTED_PROMPTS.slice(0, 3)
  const suggestionList = suggestions.map((prompt) => `- ${prompt}`).join('\n')

  return {
    matched: false,
    content: `I could not find that question in my current mock knowledge.\n\nTry one of these questions:\n${suggestionList}`,
    supportedPrompts: SUPPORTED_PROMPTS,
  }
}
