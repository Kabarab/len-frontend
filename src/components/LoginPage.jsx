import { auth, googleProvider, signInWithPopup } from '../firebase';
import { GoogleAuthProvider } from "firebase/auth"; // Добавляем этот импорт

function LoginPage() {
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Успешный вход
        const user = result.user;
        console.log('Успешный вход:', user);
      })
      .catch((error) => {
        // Улучшенная обработка ошибок
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Подробная ошибка входа через Google:", {
            code: errorCode,
            message: errorMessage,
        });
        // Показываем пользователю более понятное сообщение
        if (errorCode === 'auth/popup-closed-by-user') {
          alert('Окно входа было закрыто. Пожалуйста, попробуйте еще раз.');
        } else {
          alert(`Произошла ошибка входа: ${errorMessage}`);
        }
      });
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Добро пожаловать в len</h1>
      <p>Войдите, чтобы начать создавать свои рабочие процессы.</p>
      <button onClick={handleGoogleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Войти через Google
      </button>
    </div>
  );
}

export default LoginPage;
