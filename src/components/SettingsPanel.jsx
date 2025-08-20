import { useState, useEffect } from 'react';
import './SettingsPanel.css';

function SettingsPanel({ 
    node, 
    onSave, 
    onGetChatId, 
    isFetchingChatId, 
    workflowId,
    onSetWebhook,
    isSettingWebhook
}) {
  const [botToken, setBotToken] = useState(node.data.botToken || '');
  const [chatId, setChatId] = useState(node.data.chatId || '');
  const [message, setMessage] = useState(node.data.message || '');

  useEffect(() => {
    setBotToken(node.data.botToken || '');
    setChatId(node.data.chatId || '');
    setMessage(node.data.message || '');
  }, [node.id]);

  const handleSave = () => {
    onSave(node.id, { botToken, chatId, message });
  };

  const handleGetChatId = async () => {
      const newChatId = await onGetChatId(botToken);
      if (newChatId) {
          setChatId(newChatId);
      }
  };

  // В зависимости от типа узла, показываем разные настройки
  if (node.type === 'telegramTrigger') {
    return (
      <aside className="settings-panel">
        <div className="settings-header">Настройки Триггера Telegram</div>
        <div className="settings-body">
          <label>Токен Бота:</label>
          <p>Вставьте сюда токен вашего Telegram-бота, чтобы активировать триггер.</p>
          <input 
            type="text" 
            value={botToken} 
            onChange={(e) => setBotToken(e.target.value)} 
            placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
          />
          <button 
            className="save-settings-button" 
            onClick={() => onSetWebhook(botToken)}
            disabled={isSettingWebhook || !botToken}
          >
            {isSettingWebhook ? 'Активация...' : 'Активировать триггер'}
          </button>
          <hr />
          <p>После активации ваш рабочий процесс будет автоматически запускаться каждый раз, когда кто-то напишет вашему боту.</p>
        </div>
      </aside>
    );
  }

  // Настройки по умолчанию для узла-действия Telegram
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
      <button className="save-settings-button" onClick={handleSave}>Применить настройки</button>
    </aside>
  );
}

export default SettingsPanel;