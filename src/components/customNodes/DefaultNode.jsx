import { Handle, Position } from 'reactflow';
import './DefaultNode.css';

function DefaultNode({ id, data }) {
  const onPlusClick = (event) => {
    event.stopPropagation();
    data.onAddNode(id, event);
  };

  return (
    <div className="default-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="custom-handle" />
      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default DefaultNode;
