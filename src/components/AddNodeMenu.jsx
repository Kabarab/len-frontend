// len-frontend/src/components/AddNodeMenu.jsx

import './AddNodeMenu.css';

function AddNodeMenu({ top, left, onSelectNode }) {
  return (
    <div className="add-node-menu" style={{ top, left }}>
      <div className="add-node-menu-header">Выберите узел</div>
      <button onClick={() => onSelectNode('telegram')}>Узел Telegram</button>
      <button onClick={() => onSelectNode('httpRequest')}>HTTP Запрос</button>
      <button onClick={() => onSelectNode('huggingFace')}>Hugging Face</button>
      <button onClick={() => onSelectNode('chatGPT')}>ChatGPT</button>
      {/* --- ДОБАВЛЕНО YANDEX --- */}
      <button onClick={() => onSelectNode('yandexgpt')}>YandexGPT</button>
      <button onClick={() => onSelectNode('deepseek')}>Deepseek</button>
    </div>
  );
}

export default AddNodeMenu;