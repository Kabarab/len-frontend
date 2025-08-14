// ИСПРАВЛЕНИЕ: Используем переименованный файл стилей
import './NodeContextMenu.css';

function PaneContextMenu({ top, left, onAction }) {
  return (
    <div className="context-menu" style={{ top, left }}>
      <button onClick={() => onAction('addTelegramNode')}>Добавить узел Telegram</button>
      <button onClick={() => onAction('addDefaultNode')}>Добавить стандартный узел</button>
      {/* Сюда можно будет добавить другие узлы */}
    </div>
  );
}

export default PaneContextMenu;
