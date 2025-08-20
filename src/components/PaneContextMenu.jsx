import './NodeContextMenu.css';

function PaneContextMenu({ top, left, onAction }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      <div className="context-menu-header">Добавить узел</div>
      {/* Теперь здесь есть все типы узлов */}
      <button onClick={() => onAction('addTelegramTriggerNode')}>Триггер Telegram</button>
      <button onClick={() => onAction('addTelegramNode')}>Узел Telegram</button>
      <button onClick={() => onAction('addInputNode')}>Узел входа</button>
      <button onClick={() => onAction('addDefaultNode')}>Стандартный узел</button>
      <button onClick={() => onAction('addOutputNode')}>Узел выхода</button>
    </div>
  );
}

export default PaneContextMenu;
