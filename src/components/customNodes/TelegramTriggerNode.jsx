import { Handle, Position } from 'reactflow';
import './TelegramTriggerNode.css';

function TelegramTriggerNode({ id, data }) {
  const onPlusClick = (event) => {
    event.stopPropagation();
    data.onAddNode(id, event);
  };

  return (
    <div className="telegram-trigger-node custom-node">
      <div className="node-header">
        <img src="/icons/telegram.png" alt="Telegram" className="node-icon" width="24" height="24" />
        <div className="node-title">Триггер Telegram</div>
      </div>
      <div className="node-body">
        Получает новые сообщения
      </div>
      <Handle type="source" position={Position.Bottom} className="custom-handle" />

      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default TelegramTriggerNode;
