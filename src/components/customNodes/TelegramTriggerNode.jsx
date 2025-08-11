import { Handle, Position } from 'reactflow';
import './TelegramTriggerNode.css';

function TelegramTriggerNode({ data }) {
  return (
    <div className="telegram-trigger-node">
      <div className="node-header">
        <img src="/icons/telegram.png" alt="Telegram" className="node-icon" width="24" height="24" />
        <div className="node-title">Триггер Telegram</div>
      </div>
      <div className="node-body">
        Получает новые сообщения
      </div>
      {/* У этого узла есть только выход (source), но нет входа (target) */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TelegramTriggerNode;
