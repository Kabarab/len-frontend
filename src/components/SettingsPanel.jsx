import { useState, useEffect } from 'react';
import './SettingsPanel.css';

// --- Компонент для настроек ТРИГГЕРА TELEGRAM ---
const TelegramTriggerSettings = ({ node, onSave, onSetWebhook, isSettingWebhook, onDeleteWebhook, isDeletingWebhook }) => {
  const [botToken, setBotToken] = useState(node.data.botToken || '');

  useEffect(() => {
    setBotToken(node.data.botToken || '');
  }, [node.data]);

  const handleSave = () => {
    onSave(node.id, { botToken });
  };

  return (
    <div className="telegram-trigger-settings">
      <div className="settings-header">Настройки Триггера</div>
      <div className="settings-content">
        <label>1. Токен Бота:</label>
        <p>Вставьте сюда токен вашего Telegram-бота и примените его.</p>
        <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} />
        <button className="save-button" onClick={handleSave}>
          Применить токен
        </button>
        <hr />
        <label>2. Управление Вебхуком:</label>
        <p>Активируйте триггер, чтобы начать получать сообщения.</p>
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
    </div>
  );
};

// --- Компонент для настроек УЗЛА TELEGRAM ---
const TelegramNodeSettings = ({ node, onSave, onGetChatId, isFetchingChatId }) => {
    const [botToken, setBotToken] = useState(node.data.botToken || '');
    const [chatId, setChatId] = useState(node.data.chatId || '');
    const [message, setMessage] = useState(node.data.message || '');

    useEffect(() => {
        setBotToken(node.data.botToken || '');
        setChatId(node.data.chatId || '');
        setMessage(node.data.message || '');
    }, [node.data]);

    const handleSave = () => {
        onSave(node.id, { botToken, chatId, message });
    };

    const handleGetId = async () => {
        const newChatId = await onGetChatId(botToken);
        if (newChatId) {
            setChatId(newChatId);
        }
    };

    return (
        <div className="telegram-node-settings">
            <div className="settings-header">Настройки узла: Telegram</div>
            <div className="settings-content">
                <label>Токен Бота:</label>
                <input type="text" value={botToken} onChange={(e) => setBotToken(e.target.value)} />

                <label>ID Чата:</label>
                <div className="chat-id-wrapper">
                    <input type="text" value={chatId} onChange={(e) => setChatId(e.target.value)} />
                    <button onClick={handleGetId} disabled={isFetchingChatId || !botToken}>
                        {isFetchingChatId ? '...' : 'Получить'}
                    </button>
                </div>
                <small>Отправьте любое сообщение боту и нажмите "Получить".</small>

                <label>Сообщение:</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4"></textarea>
                <small>Используйте `{'{{trigger.message.text}}'}` для вставки текста из триггера.</small>
            </div>
             <button className="save-button" onClick={handleSave}>Применить настройки</button>
        </div>
    );
};

// --- Компонент для настроек УЗЛА HTTP ---
const HttpRequestSettings = ({ node, onSave }) => {
    const [url, setUrl] = useState(node.data.url || '');
    const [method, setMethod] = useState(node.data.method || 'GET');
    const [headers, setHeaders] = useState(typeof node.data.headers === 'object' ? JSON.stringify(node.data.headers, null, 2) : node.data.headers || '{}');
    const [body, setBody] = useState(typeof node.data.body === 'object' ? JSON.stringify(node.data.body, null, 2) : node.data.body || '{}');
    const [jsonError, setJsonError] = useState('');

    useEffect(() => {
        setUrl(node.data.url || '');
        setMethod(node.data.method || 'GET');
        setHeaders(typeof node.data.headers === 'object' ? JSON.stringify(node.data.headers, null, 2) : node.data.headers || '{}');
        setBody(typeof node.data.body === 'object' ? JSON.stringify(node.data.body, null, 2) : node.data.body || '{}');
    }, [node.data]);

    const handleJsonChange = (setter, value) => {
        setter(value);
        try {
            JSON.parse(value);
            setJsonError('');
        } catch (e) {
            setJsonError('Неверный формат JSON');
        }
    };

    const handleSave = () => {
        if (jsonError) {
            alert('Пожалуйста, исправьте ошибку в JSON перед сохранением.');
            return;
        }
        onSave(node.id, { url, method, headers, body });
    };

    return (
        <div className="http-request-settings">
            <div className="settings-header">Настройки HTTP-запроса</div>
            <div className="settings-content">
                <label>Метод:</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>
                <label>URL:</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                <label>Заголовки (JSON):</label>
                <textarea value={headers} onChange={(e) => handleJsonChange(setHeaders, e.target.value)} rows="5" className={jsonError ? 'json-error' : ''}></textarea>
                <label>Тело запроса (JSON):</label>
                <textarea value={body} onChange={(e) => handleJsonChange(setBody, e.target.value)} rows="8" className={jsonError ? 'json-error' : ''}></textarea>
                {jsonError && <small className="error-message">{jsonError}</small>}
            </div>
            <button className="save-button" onClick={handleSave}>Применить настройки</button>
        </div>
    );
};

// --- Компонент для настроек УЗЛА HUGGING FACE ---
const HuggingFaceSettings = ({ node, onSave }) => {
    const [hfToken, setHfToken] = useState(node.data.hfToken || '');
    const [modelUrl, setModelUrl] = useState(node.data.modelUrl || '');
    const [prompt, setPrompt] = useState(node.data.prompt || '');

    useEffect(() => {
        setHfToken(node.data.hfToken || '');
        setModelUrl(node.data.modelUrl || '');
        setPrompt(node.data.prompt || '');
    }, [node.data]);

    const handleSave = () => {
        onSave(node.id, { hfToken, modelUrl, prompt });
    };

    return (
        <div className="hugging-face-settings">
            <div className="settings-header">Настройки Hugging Face</div>
            <div className="settings-content">
                <div className="label-with-tooltip">
                  <label>API Токен:</label>
                  <div className="tooltip-container">
                    <div className="tooltip-icon">i</div>
                    <span className="tooltip-text">
                      1. Зайдите на huggingface.co<br/>
                      2. Кликните на свой профиль → Settings<br/>
                      3. Перейдите в Access Tokens<br/>
                      4. Создайте (New token) или скопируйте существующий токен.
                    </span>
                  </div>
                </div>
                <input type="password" value={hfToken} onChange={(e) => setHfToken(e.target.value)} />
                <small>Ваш токен доступа с сайта Hugging Face.</small>
                
                <label>URL Модели:</label>
                <input type="text" value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} />
                <small>Например: https://api-inference.huggingface.co/models/gpt2</small>
                
                <label>Запрос (Prompt):</label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="6"></textarea>
                <small>Можно использовать плейсхолдеры, например `{'{{trigger.message.text}}'}`</small>
            </div>
            <button className="save-button" onClick={handleSave}>Применить настройки</button>
        </div>
    );
};


// --- ГЛАВНЫЙ КОМПОНЕНТ-ПЕРЕКЛЮЧАТЕЛЬ ---
function SettingsPanel(props) {
    const { node } = props;

    if (!node) {
        return null;
    }

    const renderSettings = () => {
        switch (node.type) {
            case 'telegramTrigger':
                return <TelegramTriggerSettings {...props} />;
            case 'telegram':
                return <TelegramNodeSettings {...props} />;
            case 'httpRequest':
                return <HttpRequestSettings {...props} />;
            case 'huggingFace':
                return <HuggingFaceSettings {...props} />;
            default:
                return null;
        }
    };

    return (
        <aside className="settings-panel">
            {renderSettings()}
        </aside>
    );
}

export default SettingsPanel;