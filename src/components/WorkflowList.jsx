import WorkflowItem from './WorkflowItem';
import './WorkflowList.css';

function WorkflowList({ workflows, onDelete, onSelect }) {
  return (
    <ul className="workflow-list">
      {workflows.map(workflow => (
        <WorkflowItem 
          key={workflow.id}
          id={workflow.id}
          name={workflow.name}
          enabled={workflow.enabled}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

export default WorkflowList;
