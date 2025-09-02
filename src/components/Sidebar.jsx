// len-frontend/src/components/Sidebar.jsx

import './Sidebar.css';

function Sidebar({ onNodeClick, className }) {
  const onDragStart = (event, nodeType, defaultData) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (defaultData) {
      event.dataTransfer.setData('application/reactflow-data', JSON.stringify(defaultData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
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
        onClick={() => onNodeClick('telegram', { message: '' })}
        onDragStart={(event) => onDragStart(event, 'telegram', { message: '' })}
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

      <div
        className="sidebar-node huggingface"
        onClick={() => onNodeClick('huggingFace', { modelUrl: 'gpt2', prompt: '' })}
        onDragStart={(event) => onDragStart(event, 'huggingFace', { modelUrl: 'gpt2', prompt: '' })}
        draggable
      >
        Hugging Face
      </div>
      
      <div
        className="sidebar-node chatgpt"
        onClick={() => onNodeClick('chatGPT', { model: 'gpt-3.5-turbo', prompt: '' })}
        onDragStart={(event) => onDragStart(event, 'chatGPT', { model: 'gpt-3.5-turbo', prompt: '' })}
        draggable
      >
        ChatGPT
      </div>
      
      {/* --- ИСПРАВЛЕННЫЙ БЛОК YANDEXGPT --- */}
      <div
        className="sidebar-node yandexgpt" 
        onClick={() => onNodeClick('yandexgpt', { model: 'yandexgpt-lite', prompt: '' })}
        onDragStart={(event) => onDragStart(event, 'yandexgpt', { model: 'yandexgpt-lite', prompt: '' })}
        draggable
      >
        YandexGPT
      </div>

      <div
        className="sidebar-node deepseek"
        onClick={() => onNodeClick('deepseek', { model: 'deepseek-chat', prompt: '' })}
        onDragStart={(event) => onDragStart(event, 'deepseek', { model: 'deepseek-chat', prompt: '' })}
        draggable
      >
        Deepseek
      </div>
    </aside>
  );
}

export default Sidebar;