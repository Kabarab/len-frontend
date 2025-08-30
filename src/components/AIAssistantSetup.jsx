import { useState } from 'react';
import './AIAssistantSetup.css';

// Эта функция будет передана из App.jsx
function AIAssistantSetup({ onCreateAssistant, creating }) {
  const [botToken, setBotToken] = useState('');
  const [hfToken, setHfToken] = useState('');
  const [modelUrl, setModelUrl] = useState('https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!botToken.trim() || !hfToken.trim() || !modelUrl.trim()) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
    onCreateAssistant({ botToken, hfToken, modelUrl });
  };

  return (
    <div className="ai-assistant-setup">
      <h2>Быстрый старт: Создать AI-ассистента</h2>
      <p>Создайте готовый рабочий процесс для Telegram-бота, который отвечает с помощью нейросети. Просто введите ваши токены.</p>
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
          <label htmlFor="hf-token">API Токен Hugging Face:</label>
          <input
            id="hf-token"
            type="password"
            placeholder="Например: hf_..."
            value={hfToken}
            onChange={(e) => setHfToken(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="model-url">URL Модели Hugging Face:</label>
          <input
            id="model-url"
            type="text"
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
          />
        </div>
        <button type="submit" disabled={creating}>
          {creating ? 'Создание...' : 'Создать ассистента'}
        </button>
      </form>
    </div>
  );
}

export default AIAssistantSetup;