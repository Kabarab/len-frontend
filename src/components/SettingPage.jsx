import { useState, useEffect } from 'react';
import './SettingsPage.css';

function SettingsPage({ getAuthHeaders, API_URL }) {
  const [secrets, setSecrets] = useState({
    telegram: '',
    openai: '',
    yandex: '',
    yandexFolderId: '',
    huggingface: '',
    deepseek: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/api/secrets`, { headers });
        if (response.ok) {
          const data = await response.json();
          setSecrets(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Ошибка при загрузке ключей:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSecrets();
  }, [getAuthHeaders, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSecrets(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/secrets`, {
        method: 'POST',
        headers,
        body: JSON.stringify(secrets)
      });
      if (response.ok) {
        alert('Настройки успешно сохранены!');
      } else {
        throw new Error('Не удалось сохранить настройки');
      }
    } catch (error) {
      console.error("Ошибка при сохранении ключей:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Загрузка настроек...</div>;
  }

  return (
    <div className="settings-page">
      <p>Здесь вы можете сохранить ваши API-ключи и токены. Они будут автоматически подставляться при создании новых узлов в редакторе.</p>
      <form onSubmit={handleSave} className="settings-form">
        
        <div className="settings-section">
          <h3>Telegram</h3>
          <label htmlFor="telegram">Токен Telegram-бота:</label>
          <input
            id="telegram"
            name="telegram"
            type="password"
            value={secrets.telegram}
            onChange={handleChange}
            placeholder="123456:ABC-DEF1234..."
          />
        </div>

        <div className="settings-section">
          <h3>OpenAI (ChatGPT)</h3>
          <label htmlFor="openai">API Ключ:</label>
          <input
            id="openai"
            name="openai"
            type="password"
            value={secrets.openai}
            onChange={handleChange}
            placeholder="sk-..."
          />
        </div>
        
        <div className="settings-section">
          <h3>Deepseek</h3>
          <label htmlFor="deepseek">API Ключ:</label>
          <input
            id="deepseek"
            name="deepseek"
            type="password"
            value={secrets.deepseek}
            onChange={handleChange}
            placeholder="sk-..."
          />
        </div>

        <div className="settings-section">
          <h3>YandexGPT</h3>
          <label htmlFor="yandex">API Ключ:</label>
          <input
            id="yandex"
            name="yandex"
            type="password"
            value={secrets.yandex}
            onChange={handleChange}
            placeholder="y0_gA...AA"
          />
          <label htmlFor="yandexFolderId">Folder ID:</label>
          <input
            id="yandexFolderId"
            name="yandexFolderId"
            type="text"
            value={secrets.yandexFolderId}
            onChange={handleChange}
            placeholder="b1gvmob95yys********"
          />
        </div>
        
        <div className="settings-section">
          <h3>Hugging Face</h3>
          <label htmlFor="huggingface">API Токен:</label>
          <input
            id="huggingface"
            name="huggingface"
            type="password"
            value={secrets.huggingface}
            onChange={handleChange}
            placeholder="hf_..."
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить настройки'}
        </button>
      </form>
    </div>
  );
}

export default SettingsPage;

