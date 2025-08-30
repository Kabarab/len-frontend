import { Handle, Position } from 'reactflow';
import './HttpRequestNode.css';

function HttpRequestNode({ id, data }) {
  const method = data.method || 'GET';

  const onPlusClick = (event) => {
    event.stopPropagation();
    data.onAddNode(id, event);
  };

  return (
    <div className="http-request-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />
      
      <div className="node-header">
        <img src="/icons/http.svg" alt="HTTP" className="node-icon" width="20" height="20" />
        <div className="node-title">HTTP Запрос</div>
      </div>
      
      <div className="node-body">
        <div className="http-method">{method}</div>
        <div className="http-url" title={data.url}>{data.url || 'URL не задан'}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
      <div className="add-node-button" onClick={onPlusClick}>+</div>
    </div>
  );
}

export default HttpRequestNode;