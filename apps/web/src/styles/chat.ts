export // Custom styles to integrate with our design
const customChatStyles = `
  .custom-chat-container .str-chat {
    background: transparent;
    height: 100%;
  }
  
  .custom-chat-container .str-chat__channel-list {
    background: transparent;
  }
  
  .custom-chat-container .str-chat__main-panel {
    background: rgba(30, 41, 59, 0.8) !important;
    backdrop-filter: blur(12px) !important;
    border-radius: 0 16px 16px 0;
  }
  
    .custom-chat-container .str-chat__message-list {
      background: #0f172a !important;
      padding: 16px !important;
    }
      
    .custom-chat-container .str-chat__channel-header-title {
      color: white !important;
    }
  
  .custom-chat-container .str-chat__message-list-scroll {
    background: #0f172a !important;
  }
  
  .custom-chat-container .str-chat__main-panel {
    background: #0f172a !important;
  }
  
  .custom-chat-container .str-chat__channel {
    background: #0f172a !important;
  }

  /* Manually target main container components */
  .custom-chat-container .str-chat__main-panel {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__window {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__channel-header {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__virtual-message-list {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__message-list-wrapper {
    background: #0f172a !important;
  }

  /* Add more container components */
  .custom-chat-container .str-chat__main-panel-inner {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__channel-inner {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__window-wrapper {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__message-list-container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread-container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__virtual-list {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__channel-component {
    background: #0f172a !important;
  }

  /* Add more potential components */
  .custom-chat-container .str-chat__loading {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__list {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__header {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__wrapper {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__content {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__panel {
    background: #0f172a !important;
  }

  /* Style timestamp divider lines */
  .custom-chat-container .str-chat__date-separator {
    background: transparent !important;
    border: none !important;
  }

  .custom-chat-container .str-chat__date-separator-line {
    border-color: rgba(100, 116, 139, 0.3) !important;
    opacity: 0.5 !important;
  }

  .custom-chat-container .str-chat__date-separator-date {
    background: rgba(15, 23, 42, 0.9) !important;
    color: rgba(148, 163, 184, 0.8) !important;
    font-size: 12px !important;
    padding: 4px 12px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(100, 116, 139, 0.2) !important;
  }

  /* Fix hover colors for message action buttons (reactions, thread, etc.) */
  .custom-chat-container .str-chat__message-actions button:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
    color: rgb(0, 206, 209) !important;
  }

  .custom-chat-container .str-chat__message-action:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  .custom-chat-container [data-testid="message-action"]:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  .custom-chat-container .str-chat__message-simple__actions button:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  /* Fix thread panel background */
  .custom-chat-container .str-chat__thread {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread-container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread-header {
    background: #0f172a !important;
    border-bottom: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
    padding: 16px !important;
  }

  .custom-chat-container .str-chat__thread-header h3 {
    color: white !important;
  }

  /* Make thread close button (X) white - more aggressive */
  .custom-chat-container .str-chat__thread-header button * {
    color: white !important;
    fill: white !important;
    stroke: white !important;
  }

  .custom-chat-container .str-chat__thread-header [role="button"] {
    color: white !important;
  }

  .custom-chat-container .str-chat__thread-header [role="button"] * {
    color: white !important;
    fill: white !important;
  }

  /* Fix reactions background and selector */
  .custom-chat-container .str-chat__reaction-list {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(8px) !important;
  }

  .custom-chat-container .str-chat__reaction {
    background: rgba(51, 65, 85, 0.8) !important;
    border: 1px solid rgba(0, 206, 209, 0.2) !important;
    color: white !important;
  }

  .custom-chat-container .str-chat__reaction:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  /* Fix reaction selector popup */
  .custom-chat-container .str-chat__reaction-selector {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
  }

  .custom-chat-container .str-chat__reaction-selector-emoji {
    background: transparent !important;
  }

  .custom-chat-container .str-chat__reaction-selector-emoji:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-radius: 6px !important;
  }

  /* Fix emoji picker and other popups - more aggressive */
  .str-chat__emoji-picker {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
  }

  .str-chat__reaction-selector {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
  }

  /* Target the actual emoji picker components */
  .emoji-mart {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
  }

  .emoji-mart-bar {
    background: rgba(30, 41, 59, 0.9) !important;
    border-color: rgba(0, 206, 209, 0.3) !important;
  }

  .emoji-mart-category {
    background: transparent !important;
  }

  /* More emoji picker components */
  .emoji-mart-scroll {
    background: transparent !important;
  }

  .emoji-mart-search input {
    background: rgba(30, 41, 59, 0.9) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
  }

  .emoji-mart-category-label {
    background: rgba(30, 41, 59, 0.9) !important;
    color: white !important;
  }

  .emoji-mart-emoji:hover {
    background: rgba(0, 206, 209, 0.2) !important;
  }

  /* Stream Chat specific emoji components */
  .str-chat__emoji-picker-container {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
  }

  .str-chat__emoji-picker-wrapper {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  /* Try specific emoji picker selectors */
  .str-chat__emoji-picker-content {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .str-chat__emoji-picker-body {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .str-chat__emoji-picker-panel {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .str-chat__emoji-picker-dropdown {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }

  .str-chat__message-input-emoji-picker {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }

  /* Try common emoji picker library classes */
  .emoji-picker-react {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
  }

  .EmojiPickerReact {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }

  .epr-main {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .epr-body {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .epr-search-container {
    background: rgba(30, 41, 59, 0.9) !important;
  }

  .epr-search {
    background: rgba(30, 41, 59, 0.9) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
  }

  /* Fix tooltip and popup backgrounds */
  .custom-chat-container .str-chat__tooltip {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
    border-radius: 8px !important;
    backdrop-filter: blur(8px) !important;
  }

  /* Fix general action elements with better borders */
  .custom-chat-container .str-chat__message-actions {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 8px !important;
    backdrop-filter: blur(8px) !important;
  }

  .custom-chat-container .str-chat__message-input {
    background: rgba(30, 41, 59, 0.9) !important;
    border-top: 2px solid rgba(100, 116, 139, 0.3) !important;
    backdrop-filter: blur(12px) !important;
    padding: 20px !important;
  }
  
  .custom-chat-container .str-chat__message-input__wrapper {
    background: rgba(51, 65, 85, 0.9) !important;
    border: 2px solid rgba(100, 116, 139, 0.4) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(8px) !important;
    padding: 12px 16px !important;
  }
  
  .custom-chat-container .str-chat__message-input__wrapper:focus-within {
    border-color: rgba(0, 206, 209, 0.8) !important;
    box-shadow: 0 0 0 4px rgba(0, 206, 209, 0.15) !important;
    background: rgba(51, 65, 85, 0.95) !important;
  }
  
  .custom-chat-container .str-chat__message-input-inner {
    color: white !important;
    background: transparent !important;
    font-size: 14px !important;
    padding: 8px 0 !important;
  }
  
  .custom-chat-container .str-chat__message-input-inner::placeholder {
    color: rgb(148, 163, 184) !important;
  }
  
  .custom-chat-container .str-chat__textarea__textarea {
    color: white !important;
    background: transparent !important;
    resize: none !important;
  }
  
  .custom-chat-container .str-chat__file-input-button {
    background: rgba(0, 206, 209, 0.2) !important;
    border: 2px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    color: rgb(0, 206, 209) !important;
    backdrop-filter: blur(4px) !important;
    padding: 8px !important;
    transition: all 0.3s ease !important;
  }
  
  .custom-chat-container .str-chat__file-input-button:hover {
    background: rgba(0, 206, 209, 0.3) !important;
    border-color: rgba(0, 206, 209, 0.5) !important;
    transform: scale(1.05) !important;
  }
  

  
  .custom-chat-container .str-chat__message-simple__content {
    background: rgba(51, 65, 85, 0.9) !important;
    border: 1px solid rgba(100, 116, 139, 0.3) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(8px) !important;
    padding: 12px 16px !important;
    margin: 4px 0 !important;
  }
  
  .custom-chat-container .str-chat__message-simple__text {
    color: white !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
  
  .custom-chat-container .str-chat__message-simple__text__inner p {
    color: white !important;
    margin: 0 !important;
  }
  
  .custom-chat-container .str-chat__avatar-image {
    border: 2px solid rgba(100, 116, 139, 0.3) !important;
    border-radius: 50% !important;
  }
  
  .custom-chat-container .str-chat__message-team__content {
    background: rgba(0, 206, 209, 0.15) !important;
    border: 1px solid rgba(0, 206, 209, 0.4) !important;
    border-radius: 16px !important;
  }
  
  .custom-chat-container .str-chat__message-team .str-chat__message-simple__text {
    color: rgb(0, 206, 209) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--received {
    background: rgba(51, 65, 85, 0.9) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--sent {
    background: rgba(0, 206, 209, 0.2) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--sent .str-chat__message-simple__text {
    color: rgb(0, 206, 209) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--sent .str-chat__message-simple__text__inner p {
    color: rgb(0, 206, 209) !important;
  }
  
  .custom-chat-container .str-chat__message-timestamp {
    color: rgb(148, 163, 184) !important;
    font-size: 11px !important;
  }
`
