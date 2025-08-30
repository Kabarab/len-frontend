import { Handle, Position } from 'reactflow';
import './HuggingFaceNode.css'; // Мы создадим этот файл следующим

function HuggingFaceNode({ id, data }) {
  const onPlusClick = (event) => {
    event.stopPropagation();
    data.onAddNode(id, event);
  };

  return (
    <div className="huggingface-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />
      
      <div className="node-header">
        <img src="/icons/huggingface.png" alt="Hugging Face" className="node-icon" width="24" height="24" />
        <div className="node-title">Hugging Face</div>
      </div>
      
      <div className="node-body">
        <div className="node-model-name" title={data.modelUrl}>
          {data.modelUrl || 'Модель не указана'}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default HuggingFaceNode;