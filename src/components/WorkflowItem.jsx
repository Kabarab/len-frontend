function WorkflowItem({ id, name, enabled, onDelete, onSelect }) {
  const statusClass = enabled ? 'status-enabled' : 'status-disabled';
  const statusText = enabled ? 'Включен' : 'Выключен';

  return (
    <li className="workflow-item" onClick={() => onSelect(id)}>
      <span className="workflow-name">{name}</span>
      <div className="workflow-controls">
        <span className={`workflow-status ${statusClass}`}>{statusText}</span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(id); }} className="delete-button">
          Удалить
        </button>
      </div>
    </li>
  );
}

export default WorkflowItem;
