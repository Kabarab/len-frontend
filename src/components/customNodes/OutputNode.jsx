import { Handle, Position } from 'reactflow';
import './OutputNode.css';

function OutputNode({ data }) {
  return (
    <div className="output-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />
      {data.label}
    </div>
  );
}

export default OutputNode;
