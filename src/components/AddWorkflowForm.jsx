import { useState } from 'react';
import './AddWorkflowForm.css'; // Подключаем стили

// Получаем функцию onAddWorkflow через props
function AddWorkflowForm({ onAddWorkflow }) {
  // Создаем состояние для хранения текста из поля ввода
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    event.preventDefault();

    // Проверка, что поле не пустое
    if (!name.trim()) return;

    // Вызываем "одолженную" у App.jsx функцию, передавая ей данные
    onAddWorkflow({ name: name, enabled: true });

    // Очищаем поле ввода после отправки
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-workflow-form">
      <input
        type="text"
        placeholder="Название нового процесса..."
        value={name} // Значение инпута всегда равно нашему состоянию
        onChange={(e) => setName(e.target.value)} // При каждом изменении обновляем состояние
        className="add-workflow-input"
      />
      <button type="submit" className="add-workflow-button">
        Создать
      </button>
    </form>
  );
}

export default AddWorkflowForm;