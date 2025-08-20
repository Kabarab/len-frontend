import { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import TelegramNode from './customNodes/TelegramNode';
import TelegramTriggerNode from './customNodes/TelegramTriggerNode';
import NodeContextMenu from './NodeContextMenu';
import PaneContextMenu from './PaneContextMenu';
import SettingsPanel from './SettingsPanel';
import './WorkflowEditor.css';

const nodeTypes = {
  telegram: TelegramNode,
  telegramTrigger: TelegramTriggerNode,
};
let id = 0;
const getId = () => `dndnode_${id++}`;

function WorkflowEditor({ workflowId, onBack, getAuthHeaders }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [menu, setMenu] = useState(null);
  const [settingsNode, setSettingsNode] = useState(null);
  const [isFetchingChatId, setIsFetchingChatId] = useState(false);
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddNode = useCallback((sourceNodeId) => {
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    if (!sourceNode) return;

    const newNodePosition = {
      x: sourceNode.position.x,
      y: sourceNode.position.y + 120,
    };

    const newNode = {
      id: getId(),
      type: 'default',
      position: newNodePosition,
      data: { label: 'Новый узел' },
    };

    const newEdge = {
      id: `e${sourceNodeId}-${newNode.id}`,
      source: sourceNodeId,
      target: newNode.id,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
  }, [nodes]);

  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: { ...node.data, onAddNode: handleAddNode },
  }));

  useEffect(() => {
    getAuthHeaders().then(headers => {
        fetch(`${import.meta.env.VITE_API_URL}/api/workflows/${workflowId}`, { headers })
        .then(res => res.json())
        .then(data => {
            if (data.nodes) setNodes(data.nodes);
            if (data.edges) setEdges(data.edges);
        });
    });
  }, [workflowId, getAuthHeaders]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (typeof type === 'undefined' || !type) return;
    const dataString = event.dataTransfer.getData('application/reactflow-data');
    const data = dataString ? JSON.parse(dataString) : { label: `${type} узел` };
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = { id: getId(), type, position, data };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  const handleNodeClickFromSidebar = useCallback((type, data) => {
    if (!reactFlowInstance) return;
    const position = reactFlowInstance.screenToFlowPosition({
        x: reactFlowWrapper.current.clientWidth / 2,
        y: reactFlowWrapper.current.clientHeight / 2,
    });
    const newNode = { id: getId(), type, position, data };
    setNodes((nds) => nds.concat(newNode));
    setIsSidebarOpen(false);
  }, [reactFlowInstance]);

  const handleSave = async () => {
    const headers = await getAuthHeaders();
    const nodesToSave = nodes.map(({ data, ...rest }) => {
        const { onAddNode, ...restData } = data;
        return { ...rest, data: restData };
    });
    fetch(`${import.meta.env.VITE_API_URL}/api/workflows/${workflowId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nodes: nodesToSave, edges }),
    })
    .then(res => res.json())
    .then(data => alert('Процесс сохранен!'))
    .catch(err => alert('Ошибка сохранения!'));
  };

  const handleRun = async () => {
    const headers = await getAuthHeaders();
    fetch(`${import.meta.env.VITE_API_URL}/api/workflows/${workflowId}/run`, {
      method: 'POST',
      headers,
    })
    .then(res => res.json())
    .then(result => {
      console.log("Результат выполнения:", result);
      alert(`Процесс выполнен! Путь: ${result.path.join(' -> ')}`);
    })
    .catch(err => alert('Ошибка выполнения!'));
  };

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, ...newData };
        }
        return node;
      })
    );
    setSettingsNode(null);
  };

  const handleGetChatId = async (botToken) => {
    if (!botToken) {
        alert('Пожалуйста, введите токен бота.');
        return;
    }
    setIsFetchingChatId(true);
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/telegram/get-chat-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: botToken }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Неизвестная ошибка');
        }
        alert(`ID чата получен: ${data.chatId}`);
        return data.chatId;
    } catch (error) {
        alert(`Ошибка при получении ID чата: ${error.message}`);
    } finally {
        setIsFetchingChatId(false);
    }
  };

  const handleSetWebhook = async (botToken) => {
    setIsSettingWebhook(true);
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/telegram/set-webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: botToken, workflowId: workflowId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Неизвестная ошибка');
        }
        alert(data.message);
    } catch (error) {
        alert(`Ошибка активации триггера: ${error.message}`);
    } finally {
        setIsSettingWebhook(false);
    }
  };

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const pane = reactFlowWrapper.current.getBoundingClientRect();
    setMenu({
      type: 'node',
      id: node.id,
      nodeType: node.type,
      top: event.clientY - pane.top,
      left: event.clientX - pane.left,
    });
  }, []);

  const onNodeClick = useCallback((event, node) => {
    if (window.innerWidth < 768) {
      onNodeContextMenu(event, node);
    }
  }, [onNodeContextMenu]);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    const pane = reactFlowWrapper.current.getBoundingClientRect();
    setMenu({
      type: 'pane',
      top: event.clientY - pane.top,
      left: event.clientX - pane.left,
    });
  }, []);

  const onPaneClick = useCallback(() => { setMenu(null); setSettingsNode(null); }, []);

  const createNewNode = (type, position, data) => {
    const newNode = { id: getId(), type, position, data };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleMenuAction = useCallback((action) => {
    if (action === 'openSettings' && menu.type === 'node') {
      const nodeToEdit = nodes.find(n => n.id === menu.id);
      if (nodeToEdit) {
        setSettingsNode(nodeToEdit);
      }
    } else if (action === 'deleteNode' && menu.type === 'node') {
      setNodes((nds) => nds.filter((node) => node.id !== menu.id));
    } else if (action === 'addTelegramNode' && menu.type === 'pane') {
      const position = reactFlowInstance.screenToFlowPosition({ x: menu.left, y: menu.top });
      createNewNode('telegram', position, { message: 'Новое сообщение' });
    } else if (action === 'addDefaultNode' && menu.type === 'pane') {
      const position = reactFlowInstance.screenToFlowPosition({ x: menu.left, y: menu.top });
      createNewNode('default', position, { label: 'Новый узел' });
    }
    setMenu(null);
  }, [menu, nodes, reactFlowInstance]);

  const defaultEdgeOptions = {
    animated: true,
    style: { stroke: '#1a192b' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#1a192b' },
  };

  return (
    <div className="editor-layout">
      <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
      <Sidebar onNodeClick={handleNodeClickFromSidebar} className={isSidebarOpen ? 'open' : ''} />
      <div className="workflow-editor-container" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          onNodeContextMenu={onNodeContextMenu}
          onNodeClick={onNodeClick}
          onPaneContextMenu={onPaneContextMenu}
          onPaneClick={onPaneClick}
          onMoveStart={onPaneClick}
          onNodeDragStart={onPaneClick}
          deleteKeyCode={['Backspace', 'Delete']}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        {menu?.type === 'node' && <NodeContextMenu {...menu} onAction={handleMenuAction} />}
        {menu?.type === 'pane' && <PaneContextMenu {...menu} onAction={handleMenuAction} />}
        <div className="editor-controls">
          <button onClick={onBack} className="back-button">&larr; Назад</button>
          <button onClick={handleSave} className="save-button">Сохранить</button>
          <button onClick={handleRun} className="run-button">Запустить</button>
        </div>
      </div>
      {settingsNode && (
        <SettingsPanel 
            node={settingsNode} 
            onSave={updateNodeData}
            onGetChatId={handleGetChatId}
            isFetchingChatId={isFetchingChatId}
            workflowId={workflowId}
            onSetWebhook={handleSetWebhook}
            isSettingWebhook={isSettingWebhook}
        />
      )}
    </div>
  );
}

export default WorkflowEditor;
