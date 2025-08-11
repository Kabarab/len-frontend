import './Sidebar.css';

function Sidebar() {
  const onDragStart = (event, nodeType, defaultData) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (defaultData) {
      event.dataTransfer.setData('application/reactflow-data', JSON.stringify(defaultData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Триггеры</div>
      {/* Наш новый триггер */}
      <div
        className="sidebar-node trigger"
        onDragStart={(event) => onDragStart(event, 'telegramTrigger', { label: 'Триггер Telegram' })}
        draggable
      >
        Telegram
      </div>

      <div className="sidebar-header">Действия</div>

      <div
        className="sidebar-node telegram"
        onDragStart={(event) => onDragStart(event, 'telegram', { message: 'Новое сообщение' })}
        draggable
      >
        Узел Telegram
      </div>

      <div 
        className="sidebar-node input" 
        onDragStart={(event) => onDragStart(event, 'input')} 
        draggable
      >
        Узел входа (Триггер)
      </div>
      <div 
        className="sidebar-node" 
        onDragStart={(event) => onDragStart(event, 'default')} 
        draggable
      >
        Стандартный узел
      </div>
      <div 
        className="sidebar-node output" 
        onDragStart={(event) => onDragStart(event, 'output')} 
        draggable
      >
        Узел выхода
      </div>
    </aside>
  );
}

export default Sidebar;
