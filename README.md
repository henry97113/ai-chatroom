# AI Chatroom Assignment

A floating AI chatroom widget built with **Vue 3** and **Quasar Framework**. The widget provides a mock-driven conversational experience with features like auto-scrolling, idle suggestion carousels, Markdown rendering, and grouped avatar display.

## Demo

https://github.com/user-attachments/assets/45f80cd2-4b95-495b-a996-adc99970ea0b

## File Structure

```
src/
├── components/
│   ├── AiChatWidget.vue                # ★ Top-level widget — orchestrates open/close,
│   │                                   #   scrolling, and wires all child components
│   └── ai-chat/
│       ├── AiChatHeader.vue            # Chat panel title bar with close button
│       ├── AiChatMessages.vue          # Scrollable message list; computes avatar
│       │                               #   grouping for consecutive bot messages
│       ├── AiChatMessageItem.vue       # Single message bubble (user or bot),
│       │                               #   renders Markdown content
│       ├── AiChatComposer.vue          # Text input + send button
│       ├── AiChatLauncherButton.vue    # Floating button to open the chat
│       ├── chatConstants.js            # Shared constants (thresholds, timings)
│       ├── chatUtils.js                # Utility helpers for chat logic
│       └── composables/
│           ├── useAiChatSession.js     # Core chat session state & send logic
│           └── useIdleSuggestionCarousel.js
│                                       # Timed idle suggestions when user is
│                                       #   inactive after the welcome message
│
├── services/
│   └── aiChatService.js                # Mock AI service — matches user prompts
│                                       #   against predefined Q&A pairs
│
└── mock/
    └── messages.js                     # Predefined mock Q&A data set
```

### How the pieces fit together

| Layer | File(s) | Role |
|---|---|---|
| **Entry** | `index.html` → `App.vue` → `MainLayout.vue` | Boots the app and renders the page shell |
| **Page** | `IndexPage.vue` | Host page; the chat widget floats on top of it |
| **Widget root** | `AiChatWidget.vue` | Manages open/close state, auto-scrolling, and connects the composables to child components |
| **UI components** | `AiChatHeader`, `AiChatMessages`, `AiChatMessageItem`, `AiChatComposer`, `AiChatLauncherButton` | Individual, focused UI pieces composed inside the widget |
| **State & logic** | `useAiChatSession.js`, `useIdleSuggestionCarousel.js` | Vue composables that encapsulate chat session state and idle-suggestion timing |
| **Data layer** | `aiChatService.js` → `mock/messages.js` | Service abstraction over mock data; easy to swap for a real API later |

## Development Approach

This assignment was completed primarily with **AI-assisted development**, using the **Spec-Driven Development (SDD)** workflow powered by [OpenSpec / Spectra](https://github.com/spectra-ai-codegen).

I chose this approach because it mirrors how I deliver tasks at work — leveraging AI to accelerate development while maintaining high quality through deliberate human oversight:

1. **Discuss & Plan** — I discussed the detailed implementation plan with AI, defining feature specs, component boundaries, and data flow before writing any code.
2. **Propose & Generate** — The AI generated code based on the agreed-upon specs. Each change proposal was tracked as a Spectra change artifact in `openspec/changes/`.
3. **Review & Refine** — I carefully reviewed every piece of generated code to ensure correctness, readability, and adherence to the project's conventions, iterating where needed.

The `openspec/` directory contains the full spec and change history for transparency.

## Running Locally

### Prerequisites

- **Node.js** — `v20` or later (see `engines` in `package.json`)
- **Yarn** — `v1.21+` (or npm `v6.13+`)

### Steps

```bash
# 1. Install dependencies
yarn

# 2. Start the dev server (hot-reload enabled)
yarn dev
```

The app will be available at the URL shown in the terminal (typically `http://localhost:9000`). Click the floating chat button in the bottom-right corner to open the AI chatroom widget.

### Build for production

```bash
yarn build
```

The production bundle will be output to the `dist/` directory.
