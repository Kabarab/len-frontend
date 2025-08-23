import { useState, useEffect } from 'react';
import './SettingsPanel.css';

// Главный и единственный компонент
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

  // Этот лог поможет нам в будущем, если возникнут проблемы.
  // Открой консоль разработчика в браузере (F12), чтобы увидеть, какой узел выбран.
  console.log("SettingsPanel рендерится для узла:", node);

  // --- Состояния для ВСЕХ типов узлов ---
  // Telegram & Trigger
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  
  // HTTP Request
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('{}');
  const [jsonError, setJsonError] = useState('');

  // Hugging Face
  const [hfToken, setHfToken] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [prompt, setPrompt] = useState('');

  // Этот useEffect будет правильно обновлять состояния для ЛЮБОГО выбранного узла
  useEffect(() => {
    if (node && node.data) {
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
    }
  }, [node]); // Перезапускаем эффект при смене узла

  // --- Функции сохранения для каждого типа узла ---
  const handleSave = (data) => {
    onSave(node.id, data);
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

  // --- Рендеринг ---
  // Если узел не выбран, ничего не показываем
  if (!node) {
    return null;
  }

  // Используем `if / else if` для четкого разделения логики
  if (node.type === 'telegramTrigger') {
    return (
      <aside className="settings-panel">
        <div className="telegram-trigger-settings">
          <div className="settings-header">Настройки Триггера</div>
          <div className="settings-content">
            <label>1. Токен Бота:</label>
            <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} />
            <button className="save-button" onClick={() => handleSave({ botToken })}>
              Применить токен
            </button>
            <hr />
            <label>2. Управление Вебхуком:</label>
            <div className="button-group">
              <button className="activate-button" onClick={() => onSetWebhook(botToken)} disabled={isSettingWebhook || !botToken}>
                {isSettingWebhook ? '...' : 'Активировать'}
              </button>
              <button className="deactivate-button" onClick={() => onDeleteWebhook(botToken)} disabled={isDeletingWebhook || !botToken}>
                {isDeletingWebhook ? '...' : 'Деактивировать'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  } else if (node.type === 'huggingFace') {
    return (
      <aside className="settings-panel">
        <div className="hugging-face-settings">
            <div className="settings-header">Настройки Hugging Face</div>
            <div className="settings-content">
                <label>API Токен:</label>
                <input type="password" value={hfToken} onChange={(e) => setHfToken(e.target.value)} />
                <small>Ваш токен доступа с сайта Hugging Face.</small>
                <label>URL Модели:</label>
                <input type="text" value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} />
                <small>Например: https://api-inference.huggingface.co/models/gpt2</small>
                <label>Запрос (Prompt):</label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="6"></textarea>
                <small>Используйте `{'{{trigger.message.text}}'}` для подстановки.</small>
            </div>
            <button className="save-button" onClick={() => handleSave({ hfToken, modelUrl, prompt })}>Применить настройки</button>
        </div>
      </aside>
    );
  } else if (node.type === 'httpRequest') {
    return (
      <aside className="settings-panel">
        <div className="http-request-settings">
            <div className="settings-header">Настройки HTTP-запроса</div>
            <div className="settings-content">
                <label>Метод:</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="GET">GET</option><option value="POST">POST</option><option value="PUT">PUT</option><option value="DELETE">DELETE</option><option value="PATCH">PATCH</option>
                </select>
                <label>URL:</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                <label>Заголовки (JSON):</label>
                <textarea value={headers} onChange={(e) => handleJsonChange(setHeaders, e.target.value)} rows="5" className={jsonError ? 'json-error' : ''}></textarea>
                <label>Тело запроса (JSON):</label>
                <textarea value={body} onChange={(e) => handleJsonChange(setBody, e.target.value)} rows="8" className={jsonError ? 'json-error' : ''}></textarea>
                {jsonError && <small className="error-message">{jsonError}</small>}
            </div>
            <button className="save-button" onClick={() => handleSave({ url, method, headers, body })}>Применить настройки</button>
        </div>
      </aside>
    );
  } else if (node.type === 'telegram') {
    return (
      <aside className="settings-panel">
         <div className="telegram-node-settings">
            <div className="settings-header">Настройки узла: Telegram</div>
            <div className="settings-content">
                <label>Токен Бота:</label>
                <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} />
                <label>ID Чата:</label>
                <div className="chat-id-wrapper">
                    <input type="text" value={chatId} onChange={(e) => setChatId(e.target.value)} />
                    <button onClick={() => onGetChatId(botToken)} disabled={isFetchingChatId || !botToken}>
                        {isFetchingChatId ? '...' : 'Получить'}
                    </button>
                </div>
                <small>Отправьте любое сообщение боту и нажмите "Получить".</small>
                <label>Сообщение:</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4"></textarea>
                <small>Используйте `{'{{...}}'}` для подстановки данных.</small>
            </div>
             <button className="save-button" onClick={() => handleSave({ botToken, chatId, message })}>Применить настройки</button>
        </div>
      </aside>
    );
  }

  // Если тип узла не совпал ни с одним из известных, ничего не рендерим
  return null;
}

export default SettingsPanel;