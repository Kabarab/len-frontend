import { Handle, Position } from 'reactflow';
import './YandexGPTNode.css';

function YandexGPTNode({ id, data }) {
  const onPlusClick = (event) => {
    event.stopPropagation();
    data.onAddNode(id, event);
  };

  return (
    <div className="yandexgpt-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />

      <div className="node-header">
        <img src="/icons/yandexgpt.svg" alt="YandexGPT" className="node-icon" width="24" height="24" />
        <div className="node-title">YandexGPT</div>
      </div>

      <div className="node-body">
        <div className="node-model-name" title={data.model}>
          {data.model || 'yandexgpt-lite'}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default YandexGPTNode;