import './NodeContextMenu.css';

function PaneContextMenu({ top, left, onAction }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      <div className="context-menu-header">Добавить узел</div>
      <button onClick={() => onAction('addTelegramTriggerNode')}>Триггер Telegram</button>
      <button onClick={() => onAction('addTelegramNode')}>Узел Telegram</button>
      <button onClick={() => onAction('addHttpRequestNode')}>Узел HTTP Запроса</button>
      <button onClick={() => onAction('addHuggingFaceNode')}>Узел Hugging Face</button>
      <button onClick={() => onAction('addChatGPTNode')}>Узел ChatGPT</button>
      {/* --- ДОБАВЛЕНО YANDEX --- */}
      <button onClick={() => onAction('addYandexGPTNode')}>Узел YandexGPT</button>
    </div>
  );
}

export default PaneContextMenu;