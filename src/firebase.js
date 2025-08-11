import { initializeApp } from "firebase/app";
// Импортируем все необходимое из 'firebase/auth' в одном месте
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// ВОТ СЮДА ВСТАВЬТЕ ВАШ СОБСТВЕННЫЙ ОБЪЕКТ firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyCGoVkqUgk3VKdnr2zcLbkLFymRUqpTZqE",
  authDomain: "lenom-b233f.firebaseapp.com",
  projectId: "lenom-b233f",
  storageBucket: "lenom-b233f.firebasestorage.app",
  messagingSenderId: "611028161078",
  appId: "1:611028161078:web:0b12954c2a7af8dc51be97",
  measurementId: "G-ZRP4DMQZCL"
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Создаем экземпляры сервисов
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Экспортируем все, что нам нужно, из этого одного файла
export {
    auth,
    googleProvider,
    onAuthStateChanged,
    signInWithPopup
}