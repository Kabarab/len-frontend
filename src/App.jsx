import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from './firebase';

import WorkflowList from './components/WorkflowList';
import AddWorkflowForm from './components/AddWorkflowForm';
import WorkflowEditor from './components/WorkflowEditor';
import LoginPage from './components/LoginPage';
import AIAssistantSetup from './components/AIAssistantSetup'; // --- ИМПОРТ ---

const API_URL = 'https://lenom.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Состояние для блокировки кнопки

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
    fetchWorkflows();
  }, [user]);

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

  // --- ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ СОЗДАНИЯ AI-АССИСТЕНТА ---
  const handleCreateAIAssistant = async (assistantData) => {
    setIsCreating(true);

    const triggerId = 'dndnode_0';
    const aiNodeId = 'dndnode_1';
    const responderId = 'dndnode_2';
    
    let aiNode;
    // В зависимости от выбора пользователя, создаем разный узел
    switch(assistantData.aiProvider) {
        case 'yandexgpt':
            aiNode = {
                id: aiNodeId,
                type: 'yandexgpt',
                position: { x: 250, y: 250 },
                data: {
                    apiKey: assistantData.apiKey,
                    folderId: assistantData.folderId,
                    prompt: '', // Пусто, бэкенд подставит сам
                    model: 'yandexgpt-lite'
                },
            };
            break;
        case 'chatGPT':
             aiNode = {
                id: aiNodeId,
                type: 'chatGPT',
                position: { x: 250, y: 250 },
                data: {
                    apiKey: assistantData.apiKey,
                    prompt: '',
                    model: assistantData.model
                },
            };
            break;
        case 'huggingFace':
            aiNode = {
                id: aiNodeId,
                type: 'huggingFace',
                position: { x: 250, y: 250 },
                data: {
                    hfToken: assistantData.hfToken,
                    modelUrl: assistantData.modelUrl,
                    prompt: '',
                },
            };
            break;
        default:
            alert('Неизвестный AI провайдер');
            setIsCreating(false);
            return;
    }


    // 2. Создаем структуру узлов с уже прописанными плейсхолдерами
    const template = {
      name: 'AI Telegram Assistant',
      nodes: [
        {
          id: triggerId,
          type: 'telegramTrigger',
          position: { x: 250, y: 50 },
          data: { label: 'Триггер Telegram', botToken: assistantData.botToken },
        },
        aiNode, // Подставляем созданный AI-узел
        {
          id: responderId,
          type: 'telegram',
          position: { x: 250, y: 450 },
          data: {
            botToken: assistantData.botToken,
            chatId: `{{trigger.message.chat.id}}`,
            // В зависимости от типа узла, плейсхолдер результата может быть разным
            // Эта структура универсальна для всех моих AI узлов
            message: `{{${aiNodeId}.result.alternatives[0].message.text}}`,
          },
        },
      ],
      edges: [
        { id: `e-${triggerId}-${aiNodeId}`, source: triggerId, target: aiNodeId, animated: true },
        { id: `e-${aiNodeId}-${responderId}`, source: aiNodeId, target: responderId, animated: true },
      ],
    };

    // 3. Отправляем готовый шаблон на бэкенд
    const headers = await getAuthHeaders();
    fetch(`${API_URL}/api/workflows`, {
      method: 'POST',
      headers,
      body: JSON.stringify(template),
    })
    .then(res => {
        if(!res.ok) throw new Error('Ошибка при создании процесса');
        return res.json();
    })
    .then(() => {
        alert('AI-ассистент успешно создан!');
        fetchWorkflows(); // Обновляем список процессов
    })
    .catch(err => {
        alert(err.message);
    })
    .finally(() => {
        setIsCreating(false);
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

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Рабочие процессы</h1>
        <button onClick={() => auth.signOut()} className="logout-button">Выйти</button>
      </div>
      
      {/* --- ИЗМЕНЕНИЕ: Показываем форму, если нет процессов --- */}
      {workflows.length === 0 ? (
        <AIAssistantSetup onCreateAssistant={handleCreateAIAssistant} creating={isCreating} />
      ) : (
        <>
          <AddWorkflowForm onAddWorkflow={handleAddWorkflow} />
          <WorkflowList workflows={workflows} onDelete={handleDeleteWorkflow} onSelect={setSelectedWorkflowId} />
        </>
      )}
    </div>
  );
}

export default App;