import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"; // ← Tambahkan ini

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-V53qP826F7iCZqI3oq2rw8vX_TORd4w",
  authDomain: "bounceflightgame.firebaseapp.com",
  projectId: "bounceflightgame",
  storageBucket: "bounceflightgame.appspot.com",
  messagingSenderId: "778701630141",
  appId: "1:778701630141:web:23a3937cb0b2bdb60265d4"
};

// Inisialisasi Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ← Tambahkan ini

// Fungsi register
export async function handleRegister(email, password, username) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: email,
    username: username,
    highScore: 0
  });
}

// Fungsi login
export const handleLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export { auth };
