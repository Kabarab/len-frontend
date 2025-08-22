import './NodeContextMenu.css';

function NodeContextMenu({ top, left, onAction, nodeType }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      {/* Показываем настройки для всех узлов, у которых они есть */}
      {(nodeType === 'telegram' || nodeType === 'telegramTrigger' || nodeType === 'httpRequest') && (
        <button onClick={() => onAction('openSettings')}>Настройки</button>
      )}
      <button onClick={() => onAction('deleteNode')}>Удалить узел</button>
    </div>
  );
}

export default NodeContextMenu;