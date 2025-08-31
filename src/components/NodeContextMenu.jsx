import './NodeContextMenu.css';

function NodeContextMenu({ top, left, onAction, nodeType }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      {/* --- ИСПРАВЛЕНИЕ: Добавляем 'yandexgpt' --- */}
      {(nodeType === 'telegram' || nodeType === 'telegramTrigger' || nodeType === 'httpRequest' || nodeType === 'huggingFace' || nodeType === 'chatGPT' || nodeType === 'yandexgpt') && (
        <button onClick={() => onAction('openSettings')}>Настройки</button>
      )}
      <button onClick={() => onAction('deleteNode')}>Удалить узел</button>
    </div>
  );
}

export default NodeContextMenu;