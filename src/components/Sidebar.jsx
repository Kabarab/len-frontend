import './Sidebar.css';

function Sidebar({ onNodeClick, className }) { // Принимаем className
  const onDragStart = (event, nodeType, defaultData) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (defaultData) {
      event.dataTransfer.setData('application/reactflow-data', JSON.stringify(defaultData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    // Добавляем className для управления видимостью
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">Триггеры</div>
      <div
        className="sidebar-node trigger"
        onClick={() => onNodeClick('telegramTrigger', { label: 'Триггер Telegram' })}
        onDragStart={(event) => onDragStart(event, 'telegramTrigger', { label: 'Триггер Telegram' })}
        draggable
      >
        Telegram
      </div>

      <div className="sidebar-header">Действия</div>

      <div
        className="sidebar-node telegram"
        onClick={() => onNodeClick('telegram', { message: 'Новое сообщение' })}
        onDragStart={(event) => onDragStart(event, 'telegram', { message: 'Новое сообщение' })}
        draggable
      >
        Узел Telegram
      </div>

      {/* --- НОВЫЙ УЗЕЛ --- */}
      <div
        className="sidebar-node http" // Добавим стиль для него
        onClick={() => onNodeClick('httpRequest', { method: 'GET', url: 'https://api.example.com/data' })}
        onDragStart={(event) => onDragStart(event, 'httpRequest', { method: 'GET', url: 'https://api.example.com/data' })}
        draggable
      >
        HTTP Запрос
      </div>
      {/* --- КОНЕЦ НОВОГО УЗЛА --- */}

      <div 
        className="sidebar-node input" 
        onClick={() => onNodeClick('input', { label: 'Узел входа' })}
        onDragStart={(event) => onDragStart(event, 'input')} 
        draggable
      >
        Узел входа (Триггер)
      </div>
      <div 
        className="sidebar-node" 
        onClick={() => onNodeClick('default', { label: 'Стандартный узел' })}
        onDragStart={(event) => onDragStart(event, 'default')} 
        draggable
      >
        Стандартный узел
      </div>
      <div 
        className="sidebar-node output" 
        onClick={() => onNodeClick('output', { label: 'Узел выхода' })}
        onDragStart={(event) => onDragStart(event, 'output')} 
        draggable
      >
        Узел выхода
      </div>
    </aside>
  );
}

export default Sidebar;