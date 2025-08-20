import './AddNodeMenu.css';

function AddNodeMenu({ top, left, onSelectNode }) {
  return (
    <div className="add-node-menu" style={{ top, left }}>
      <div className="add-node-menu-header">Выберите узел</div>
      <button onClick={() => onSelectNode('telegram')}>Узел Telegram</button>
      <button onClick={() => onSelectNode('input')}>Узел входа</button>
      <button onClick={() => onSelectNode('default')}>Стандартный узел</button>
      <button onClick={() => onSelectNode('output')}>Узел выхода</button>
    </div>
  );
}

export default AddNodeMenu;