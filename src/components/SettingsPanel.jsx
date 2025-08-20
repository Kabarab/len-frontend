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

  useEffect(() => {
    setBotToken(node.data.botToken || '');
    setChatId(node.data.chatId || '');
    setMessage(node.data.message || '');
  }, [node.id]);

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
  }

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
        <small>Используйте {'`{{trigger.message.text}}`'} чтобы вставить текст из триггера, и {'`{{trigger.message.chat.id}}`'} для ID чата.</small>
      </div>
      <button className="save-settings-button" onClick={handleActionNodeSave}>Применить настройки</button>
    </aside>
  );
}

export default SettingsPanel;
