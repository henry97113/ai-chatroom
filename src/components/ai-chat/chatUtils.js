export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function splitSuggestedQuestionContent(fullContent) {
  const marker = "Suggested Question:";
  const markerIndex = fullContent.indexOf(marker);

  if (markerIndex === -1) {
    return {
      mainContent: fullContent,
      suggestedQuestionContent: "",
    };
  }

  const mainContent = fullContent.slice(0, markerIndex).trimEnd();
  const suggestedQuestionBody = fullContent
    .slice(markerIndex + marker.length)
    .trim();

  return {
    mainContent,
    suggestedQuestionContent:
      suggestedQuestionBody.length > 0
        ? `${marker} ${suggestedQuestionBody}`
        : marker,
  };
}
