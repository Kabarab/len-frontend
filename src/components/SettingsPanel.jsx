import { useState, useEffect } from 'react';
import './SettingsPanel.css';

function SettingsPanel({ 
    node, 
    onSave, 
    onGetChatId, 
    isFetchingChatId, 
    workflowId,
    onSetWebhook,
    isSettingWebhook,
    onDeleteWebhook,
    isDeletingWebhook 
}) {
  const [botToken, setBotToken] = useState(node.data.botToken || '');
  const [chatId, setChatId] = useState(node.data.chatId || '');
  const [message, setMessage] = useState(node.data.message || '');

  const [url, setUrl] = useState(node.data.url || '');
  const [method, setMethod] = useState(node.data.method || 'GET');
  const [headers, setHeaders] = useState(node.data.headers || '{}');
  const [body, setBody] = useState(node.data.body || '{}');
  const [jsonError, setJsonError] = useState('');
  
  const [hfToken, setHfToken] = useState(node.data.hfToken || '');
  const [modelUrl, setModelUrl] = useState(node.data.modelUrl || '');
  const [prompt, setPrompt] = useState(node.data.prompt || '');


  useEffect(() => {
    setBotToken(node.data.botToken || '');
    setChatId(node.data.chatId || '');
    setMessage(node.data.message || '');
    
    setUrl(node.data.url || '');
    setMethod(node.data.method || 'GET');
    setHeaders(typeof node.data.headers === 'object' ? JSON.stringify(node.data.headers, null, 2) : node.data.headers || '{}');
    setBody(typeof node.data.body === 'object' ? JSON.stringify(node.data.body, null, 2) : node.data.body || '{}');

    setHfToken(node.data.hfToken || '');
    setModelUrl(node.data.modelUrl || '');
    setPrompt(node.data.prompt || '');

  }, [node.id, node.data]);

  const handleActionNodeSave = () => {
    onSave(node.id, { botToken, chatId, message });
  };

  const handleTriggerNodeSave = () => {
    onSave(node.id, { botToken });
  };

  const handleGetChatId = async () => {
      const newChatId = await onGetChatId(botToken);
      if (newChatId) {
          setChatId(newChatId);
      }
  };
  
  const handleJsonChange = (setter, value) => {
    setter(value);
    try {
        JSON.parse(value);
        setJsonError('');
    } catch (e) {
        setJsonError('Неверный формат JSON');
    }
  };
  
  const handleHttpNodeSave = () => {
    if (jsonError) {
        alert('Пожалуйста, исправьте ошибку в JSON перед сохранением.');
        return;
    }
    onSave(node.id, { url, method, headers, body });
  };

  const handleHuggingFaceNodeSave = () => {
    onSave(node.id, { hfToken, modelUrl, prompt });
  };


  // --- ИСПРАВЛЕНИЕ ЛОГИКИ РЕНДЕРИНГА ---
  // Преобразуем отдельные if в цепочку if-else if
  
  if (node.type === 'telegramTrigger') {
    return (
      <aside className="settings-panel">
        <div className="settings-header">Настройки Триггера</div>
        <div className="settings-body">
          <label>1. Токен Бота:</label>
          <p>Вставьте сюда токен вашего Telegram-бота и примените его.</p>
          <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} />
          <button className="save-settings-button" onClick={handleTriggerNodeSave}>
            Применить токен
          </button>
          <hr />
          <label>2. Управление Вебхуком:</label>
          <p>Активируйте триггер, чтобы начать получать сообщения, или деактивируйте, чтобы использовать другие методы.</p>
          <div className="button-group">
            <button 
              className="activate-button" 
              onClick={() => onSetWebhook(botToken)}
              disabled={isSettingWebhook || !botToken}
            >
              {isSettingWebhook ? '...' : 'Активировать'}
            </button>
            <button 
              className="deactivate-button"
              onClick={() => onDeleteWebhook(botToken)}
              disabled={isDeletingWebhook || !botToken}
            >
              {isDeletingWebhook ? '...' : 'Деактивировать'}
            </button>
          </div>
          <small>Примечание: Активация будет работать только после развертывания бэкенда в интернете.</small>
        </div>
      </aside>
    );
  } else if (node.type === 'httpRequest') {
    return (
        <aside className="settings-panel">
            <div className="settings-header">Настройки HTTP-запроса</div>
            <div className="settings-body">
                <label>Метод:</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="settings-select">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>

                <label>URL:</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                <small>Можно использовать плейсхолдеры, например: `https://.../users/{'{{trigger.message.chat.id}}'}`</small>

                <label>Заголовки (JSON):</label>
                <textarea 
                    value={headers} 
                    onChange={(e) => handleJsonChange(setHeaders, e.target.value)} 
                    rows="5"
                    className={jsonError ? 'json-error' : ''}
                ></textarea>

                <label>Тело запроса (JSON):</label>
                <textarea 
                    value={body} 
                    onChange={(e) => handleJsonChange(setBody, e.target.value)} 
                    rows="8"
                    className={jsonError ? 'json-error' : ''}
                ></textarea>
                {jsonError && <small className="error-message">{jsonError}</small>}

            </div>
            <button className="save-settings-button" onClick={handleHttpNodeSave}>Применить настройки</button>
        </aside>
    );
  } else if (node.type === 'huggingFace') {
    return (
      <aside className="settings-panel">
        <div className="settings-header">Настройки Hugging Face</div>
        <div className="settings-body">
          <label>API Токен:</label>
          <input type="password" value={hfToken} onChange={(e) => setHfToken(e.target.value)} />
          <small>Ваш токен доступа с сайта Hugging Face.</small>

          <label>URL Модели:</label>
          <input type="text" value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} />
          <small>Например: https://api-inference.huggingface.co/models/gpt2</small>

          <label>Запрос (Prompt):</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="6"></textarea>
          <small>Текст, который вы отправляете в модель. Можно использовать плейсхолдеры, например `{'{{trigger.message.text}}'}`</small>
        </div>
        <button className="save-settings-button" onClick={handleHuggingFaceNodeSave}>Применить настройки</button>
      </aside>
    );
  } else if (node.type === 'telegram') { // Явно указываем тип для узла Telegram
    return (
      <aside className="settings-panel">
        <div className="settings-header">Настройки узла: {node.data.label || 'Telegram'}</div>
        <div className="settings-body">
          <label>Токен Бота:</label>
          <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} />

          <label>ID Чата:</label>
          <div className="chat-id-wrapper">
              <input type="text" value={chatId} onChange={(e) => setChatId(e.target.value)} />
              <button onClick={handleGetChatId} disabled={isFetchingChatId || !botToken}>
                  {isFetchingChatId ? '...' : 'Получить'}
              </button>
          </div>
          <small>Чтобы получить ID, отправьте любое сообщение вашему боту и нажмите "Получить".</small>

          <label>Сообщение:</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4"></textarea>
          <small>Используйте `{'{{trigger.message.text}}'}` чтобы вставить текст из триггера, и `{'{{trigger.message.chat.id}}'}` для ID чата.</small>
        </div>
        <button className="save-settings-button" onClick={handleActionNodeSave}>Применить настройки</button>
      </aside>
    );
  }
  
  // Возвращаем null или пустой div, если узел не имеет настроек
  return null; 
}

export default SettingsPanel;