import { useState } from 'react';
import './AIAssistantSetup.css';

// Эта функция будет передана из App.jsx
function AIAssistantSetup({ onCreateAssistant, creating }) {
  const [botToken, setBotToken] = useState('');
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!botToken.trim() || !openAIApiKey.trim() || !model.trim()) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
    onCreateAssistant({ botToken, openAIApiKey, model });
  };

  return (
    <div className="ai-assistant-setup">
      <h2>Быстрый старт: Создать AI-ассистента</h2>
      <p>Создайте готовый рабочий процесс для Telegram-бота, который отвечает с помощью ChatGPT. Просто введите ваши токены.</p>
      <form onSubmit={handleSubmit} className="setup-form">
        <div>
          <label htmlFor="bot-token">Токен Telegram-бота:</label>
          <input
            id="bot-token"
            type="text"
            placeholder="Например: 123456:ABC-DEF1234..."
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="openai-api-key">API Ключ OpenAI (ChatGPT):</label>
          <input
            id="openai-api-key"
            type="password"
            placeholder="Например: sk-..."
            value={openAIApiKey}
            onChange={(e) => setOpenAIApiKey(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="model">Модель ChatGPT:</label>
          <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>
        <button type="submit" disabled={creating}>
          {creating ? 'Создание...' : 'Создать ассистента'}
        </button>
      </form>
    </div>
  );
}

export default AIAssistantSetup;