import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from './firebase';

import WorkflowList from './components/WorkflowList';
import AddWorkflowForm from './components/AddWorkflowForm';
import WorkflowEditor from './components/WorkflowEditor';
import LoginPage from './components/LoginPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);

  const getAuthHeaders = async () => {
    const token = user ? await user.getIdToken() : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getAuthHeaders().then(headers => {
        fetch(`${import.meta.env.VITE_API_URL}/api/workflows`, { headers })
          .then(response => {
            if (!response.ok) { throw new Error('Ошибка сети или сервера'); }
            return response.json();
          })
          .then(data => setWorkflows(data))
          .catch(error => console.error("Ошибка при загрузке процессов:", error));
      });
    } else {
      setWorkflows([]);
    }
  }, [user]);

  const handleAddWorkflow = async (newWorkflowData) => {
    const headers = await getAuthHeaders();
    fetch(`${import.meta.env.VITE_API_URL}/api/workflows`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newWorkflowData),
    })
    .then(response => response.json())
    .then(createdWorkflow => {
      setWorkflows(currentWorkflows => [...currentWorkflows, createdWorkflow]);
    });
  };

  const handleDeleteWorkflow = async (idToDelete) => {
    const headers = await getAuthHeaders();
    fetch(`${import.meta.env.VITE_API_URL}/api/workflows/${idToDelete}`, {
      method: 'DELETE',
      headers,
    })
    .then(response => {
      if (response.ok) {
        setWorkflows(currentWorkflows => 
          currentWorkflows.filter(workflow => workflow.id !== idToDelete)
        );
      }
    });
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (selectedWorkflowId) {
    return (
      <WorkflowEditor 
        workflowId={selectedWorkflowId} 
        onBack={() => setSelectedWorkflowId(null)}
        getAuthHeaders={getAuthHeaders} 
      />
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Рабочие процессы</h1>
        <button onClick={() => auth.signOut()} className="logout-button">Выйти</button>
      </div>
      <AddWorkflowForm onAddWorkflow={handleAddWorkflow} />
      <WorkflowList workflows={workflows} onDelete={handleDeleteWorkflow} onSelect={setSelectedWorkflowId} />
    </div>
  );
}

export default App;