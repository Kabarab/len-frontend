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

      <div
        className="sidebar-node http"
        onClick={() => onNodeClick('httpRequest', { method: 'GET', url: 'https://api.example.com/data' })}
        onDragStart={(event) => onDragStart(event, 'httpRequest', { method: 'GET', url: 'https://api.example.com/data' })}
        draggable
      >
        HTTP Запрос
      </div>

      {/* --- НОВЫЙ УЗЕЛ --- */}
      <div
        className="sidebar-node huggingface" // Добавим стиль для него
        onClick={() => onNodeClick('huggingFace', { modelUrl: 'gpt2', prompt: 'Hello' })}
        onDragStart={(event) => onDragStart(event, 'huggingFace', { modelUrl: 'gpt2', prompt: 'Hello' })}
        draggable
      >
        Hugging Face
      </div>
      {/* --- КОНЕЦ НОВОГО УЗЛА --- */}
    </aside>
  );
}

export default Sidebar;