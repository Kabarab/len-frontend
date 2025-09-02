import { Handle, Position } from 'reactflow';
import './DeepseekNode.css';

function DeepseekNode({ id, data }) {
  const onPlusClick = (event) => {
    event.stopPropagation();
    data.onAddNode(id, event);
  };

  return (
    <div className="deepseek-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />

      <div className="node-header">
        <img src="/icons/deepseek.svg" alt="Deepseek" className="node-icon" width="24" height="24" />
        <div className="node-title">Deepseek</div>
      </div>

      <div className="node-body">
        <div className="node-model-name" title={data.model}>
          {data.model || 'deepseek-chat'}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default DeepseekNode;
