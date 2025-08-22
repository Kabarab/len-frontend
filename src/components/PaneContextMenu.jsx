import './NodeContextMenu.css';

function PaneContextMenu({ top, left, onAction }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      <div className="context-menu-header">Добавить узел</div>
      <button onClick={() => onAction('addTelegramTriggerNode')}>Триггер Telegram</button>
      <button onClick={() => onAction('addTelegramNode')}>Узел Telegram</button>
      <button onClick={() => onAction('addHttpRequestNode')}>Узел HTTP Запроса</button>
      {/* --- ДОБАВЛЕНО --- */}
      <button onClick={() => onAction('addHuggingFaceNode')}>Узел Hugging Face</button>
    </div>
  );
}

export default PaneContextMenu;