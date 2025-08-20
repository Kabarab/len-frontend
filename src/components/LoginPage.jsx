// Импортируем все из нашего централизованного файла firebase.js
import { auth, googleProvider, signInWithPopup } from '../firebase';

function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // После успешного входа, App.jsx автоматически обнаружит это
    } catch (error) {
      console.error("Ошибка входа через Google:", error);
    }
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
