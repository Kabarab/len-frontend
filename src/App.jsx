import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from './firebase';

import WorkflowList from './components/WorkflowList';
import AddWorkflowForm from './components/AddWorkflowForm';
import WorkflowEditor from './components/WorkflowEditor';
import LoginPage from './components/LoginPage';
import SettingsPage from './components/SettingsPage'; // --- ИМПОРТ ---

const API_URL = 'https://lenom.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [view, setView] = useState('workflows'); // 'workflows', 'settings'

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
  
  const fetchWorkflows = async () => {
      if(user) {
          const headers = await getAuthHeaders();
          fetch(`${API_URL}/api/workflows`, { headers })
            .then(response => response.json())
            .then(data => setWorkflows(data))
            .catch(error => console.error("Ошибка при загрузке процессов:", error));
      } else {
          setWorkflows([]);
      }
  };

  useEffect(() => {
    if (view === 'workflows') {
        fetchWorkflows();
    }
  }, [user, view]);

  const handleAddWorkflow = async (newWorkflowData) => {
    const headers = await getAuthHeaders();
    fetch(`${API_URL}/api/workflows`, {
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
    fetch(`${API_URL}/api/workflows/${idToDelete}`, {
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
  
  const renderContent = () => {
      if (view === 'settings') {
          return <SettingsPage getAuthHeaders={getAuthHeaders} API_URL={API_URL} />;
      }
      
      return (
          <>
            <AddWorkflowForm onAddWorkflow={handleAddWorkflow} />
            <WorkflowList 
                workflows={workflows} 
                onDelete={handleDeleteWorkflow} 
                onSelect={setSelectedWorkflowId} 
            />
          </>
      )
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>{view === 'workflows' ? 'Рабочие процессы' : 'Настройки'}</h1>
        <div>
            <button onClick={() => setView(view === 'workflows' ? 'settings' : 'workflows')} className="settings-button">
                 {view === 'workflows' ? 'Настройки' : 'К процессам'}
            </button>
            <button onClick={() => auth.signOut()} className="logout-button">Выйти</button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
