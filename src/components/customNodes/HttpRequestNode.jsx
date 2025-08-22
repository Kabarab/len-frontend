import { Handle, Position } from 'reactflow';
import './HttpRequestNode.css'; // Создадим его следующим шагом

function HttpRequestNode({ id, data }) {
  // Получаем метод из данных, по умолчанию GET
  const method = data.method || 'GET';

  return (
    <div className="http-request-node custom-node">
      <Handle type="target" position={Position.Top} className="custom-handle" />
      
      <div className="node-header">
        <img src="/icons/http.svg" alt="HTTP" className="node-icon" width="20" height="20" />
        <div className="node-title">HTTP Запрос</div>
      </div>
      
      <div className="node-body">
        {/* Отображаем метод и URL, если они есть */}
        <div className="http-method">{method}</div>
        <div className="http-url" title={data.url}>{data.url || 'URL не задан'}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
    </div>
  );
}

export default HttpRequestNode;