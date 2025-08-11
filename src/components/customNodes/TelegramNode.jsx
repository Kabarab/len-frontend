import { Handle, Position } from 'reactflow';
import './TelegramNode.css';

function TelegramNode({ data }) {
  return (
    <div className="telegram-node">
      <Handle type="target" position={Position.Top} />

      <div className="node-header">
        {/* ИЗМЕНЕНИЕ: Заменяем SVG на тег img */}
        <img 
          src="/icons/telegram.png" 
          alt="Telegram" 
          className="node-icon" 
          width="24" 
          height="24" 
        />
        <div className="node-title">Telegram</div>
      </div>

      <div className="node-body">
        <label htmlFor="text">Сообщение:</label>
        <textarea id="text" name="text" rows="3" defaultValue={data.message || 'Привет, мир!'}></textarea>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TelegramNode;
