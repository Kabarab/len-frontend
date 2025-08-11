import { useState, useEffect } from 'react';
import './SettingsPanel.css';

function SettingsPanel({ node, onSave, onGetChatId, isFetchingChatId, workflowId }) {
  // Состояния для узла-действия Telegram
  const [botToken, setBotToken] = useState(node.data.botToken || '');
  const [chatId, setChatId] = useState(node.data.chatId || '');
  const [message, setMessage] = useState(node.data.message || '');

  // Уникальный URL вебхука для триггера
  const webhookUrl = `http://localhost:3000/api/webhooks/telegram/${workflowId}`;

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('URL скопирован в буфер обмена!');
  };

  // В зависимости от типа узла, показываем разные настройки
  if (node.type === 'telegramTrigger') {
    return (
      <aside className="settings-panel">
        <div className="settings-header">Настройки Триггера</div>
        <div className="settings-body">
          <label>Ваш Webhook URL:</label>
          <p>Это уникальный адрес, на который Telegram будет присылать сообщения, адресованные вашему боту.</p>
          <div className="webhook-url-wrapper">
            <input type="text" value={webhookUrl} readOnly />
            <button onClick={copyToClipboard}>Копировать</button>
          </div>
          <hr />
          <h4>Как это настроить:</h4>
          <ol className="instructions-list">
            <li>Откройте Telegram и найдите бота <strong>@BotFather</strong>.</li>
            <li>Отправьте ему команду <code>/setwebhook</code>.</li>
            <li>Выберите вашего бота из списка.</li>
            <li>Вставьте скопированный URL и отправьте его.</li>
          </ol>
          <p><strong>Что это даст?</strong> Как только вы это сделаете, ваш рабочий процесс будет автоматически запускаться каждый раз, когда кто-то напишет вашему боту.</p>
          <small>Примечание: Этот URL будет работать только после развертывания бэкенда в интернете.</small>
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
