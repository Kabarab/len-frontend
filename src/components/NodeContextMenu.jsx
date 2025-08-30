import './NodeContextMenu.css';

function NodeContextMenu({ top, left, onAction, nodeType }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      {/* --- ИСПРАВЛЕНИЕ ---
          Добавляем 'huggingFace' в список узлов, у которых есть настройки
      */}
      {(nodeType === 'telegram' || nodeType === 'telegramTrigger' || nodeType === 'httpRequest' || nodeType === 'huggingFace') && (
        <button onClick={() => onAction('openSettings')}>Настройки</button>
      )}
      <button onClick={() => onAction('deleteNode')}>Удалить узел</button>
    </div>
  );
}

export default NodeContextMenu;