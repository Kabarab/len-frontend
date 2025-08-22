import './AddNodeMenu.css';

function AddNodeMenu({ top, left, onSelectNode }) {
  return (
    <div className="add-node-menu" style={{ top, left }}>
      <div className="add-node-menu-header">Выберите узел</div>
      <button onClick={() => onSelectNode('telegram')}>Узел Telegram</button>
      <button onClick={() => onSelectNode('httpRequest')}>HTTP Запрос</button>
      {/* --- ДОБАВЛЕНО --- */}
      <button onClick={() => onSelectNode('huggingFace')}>Hugging Face</button>
    </div>
  );
}

export default AddNodeMenu;