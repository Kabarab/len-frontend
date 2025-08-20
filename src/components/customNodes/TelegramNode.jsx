import { Handle, Position } from 'reactflow';
import './TelegramNode.css';

function TelegramNode({ id, data }) {
  const onPlusClick = (event) => {
    event.stopPropagation(); // Останавливаем всплытие события
    data.onAddNode(id, event); // Передаем событие клика
  };

  return (
    <div className="telegram-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />

      <div className="node-header">
        <img src="/icons/telegram.png" alt="Telegram" className="node-icon" width="24" height="24" />
        <div className="node-title">Telegram</div>
      </div>

      <div className="node-body">
        <label htmlFor={`text-${id}`}>Сообщение:</label>
        <textarea id={`text-${id}`} name="text" rows="3" defaultValue={data.message || 'Привет, мир!'} className="nodrag"></textarea>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />

      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default TelegramNode;