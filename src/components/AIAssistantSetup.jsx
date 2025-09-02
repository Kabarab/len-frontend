// len-frontend/src/components/AIAssistantSetup.jsx

import { useState } from 'react';
import './AIAssistantSetup.css';

// Эта функция будет передана из App.jsx
function AIAssistantSetup({ onCreateAssistant, creating }) {
  const [botToken, setBotToken] = useState('');
  const [aiProvider, setAiProvider] = useState('yandexgpt'); // по умолчанию YandexGPT

  // Состояния для разных провайдеров
  const [yandexApiKey, setYandexApiKey] = useState('');
  const [yandexFolderId, setYandexFolderId] = useState('');
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const [hfToken, setHfToken] = useState('');
  const [hfModelUrl, setHfModelUrl] = useState('');
  const [deepseekApiKey, setDeepseekApiKey] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    
    const commonData = { botToken, aiProvider };
    let providerData = {};

    switch(aiProvider) {
        case 'yandexgpt':
            if (!yandexApiKey.trim() || !yandexFolderId.trim()) {
                alert('Пожалуйста, заполните API Ключ и Folder ID для YandexGPT.');
                return;
            }
            providerData = { apiKey: yandexApiKey, folderId: yandexFolderId };
            break;
        case 'chatGPT':
             if (!openAIApiKey.trim()) {
                alert('Пожалуйста, заполните API Ключ для OpenAI.');
                return;
            }
            providerData = { apiKey: openAIApiKey, model: 'gpt-3.5-turbo' };
            break;
        case 'huggingFace':
             if (!hfToken.trim() || !hfModelUrl.trim()) {
                alert('Пожалуйста, заполните API Токен и URL Модели для Hugging Face.');
                return;
            }
            providerData = { hfToken, modelUrl: hfModelUrl };
            break;
        case 'deepseek':
            if (!deepseekApiKey.trim()) {
                alert('Пожалуйста, заполните API Ключ для Deepseek.');
                return;
            }
            providerData = { apiKey: deepseekApiKey, model: 'deepseek-chat' };
            break;
        default:
            alert('Выбран неизвестный AI провайдер');
            return;
    }

    if (!botToken.trim()) {
        alert('Пожалуйста, введите токен Telegram-бота.');
        return;
    }

    onCreateAssistant({ ...commonData, ...providerData });
  };

  const renderProviderFields = () => {
    switch(aiProvider) {
        case 'yandexgpt':
            return (
                <>
                    <div>
                      <label htmlFor="yandex-api-key">API Ключ Yandex Cloud:</label>
                      <input
                        id="yandex-api-key"
                        type="password"
                        placeholder="Например: y0_gA...AA"
                        value={yandexApiKey}
                        onChange={(e) => setYandexApiKey(e.target.value)}
                      />
                    </div>
                     <div>
                      <label htmlFor="yandex-folder-id">Folder ID Yandex Cloud:</label>
                      <input
                        id="yandex-folder-id"
                        type="text"
                        placeholder="Например: b1gvmob95yys********"
                        value={yandexFolderId}
                        onChange={(e) => setYandexFolderId(e.target.value)}
                      />
                    </div>
                </>
            );
        case 'chatGPT':
            return (
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
            );
        case 'huggingFace':
            return (
                 <>
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
                      <label htmlFor="hf-model-url">URL Модели Hugging Face:</label>
                      <input
                        id="hf-model-url"
                        type="text"
                        placeholder="https://api-inference.huggingface.co/models/..."
                        value={hfModelUrl}
                        onChange={(e) => setHfModelUrl(e.target.value)}
                      />
                    </div>
                </>
            )
        case 'deepseek':
            return (
                <div>
                  <label htmlFor="deepseek-api-key">API Ключ Deepseek:</label>
                  <input
                    id="deepseek-api-key"
                    type="password"
                    placeholder="Например: sk-..."
                    value={deepseekApiKey}
                    onChange={(e) => setDeepseekApiKey(e.target.value)}
                  />
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <div className="ai-assistant-setup">
      <h2>Быстрый старт: Создать AI-ассистента</h2>
      <p>Создайте готовый рабочий процесс для Telegram-бота, который отвечает с помощью выбранного AI. Просто введите ваши токены.</p>
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
            <label htmlFor="ai-provider">AI Провайдер:</label>
            <select id="ai-provider" value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
                <option value="yandexgpt">YandexGPT</option>
                <option value="chatGPT">ChatGPT</option>
                <option value="huggingFace">Hugging Face</option>
                <option value="deepseek">Deepseek</option>
            </select>
        </div>

        {renderProviderFields()}
        
        <button type="submit" disabled={creating}>
          {creating ? 'Создание...' : 'Создать ассистента'}
        </button>
      </form>
    </div>
  );
}

export default AIAssistantSetup;