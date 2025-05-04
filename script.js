import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { handleLogin } from "./auth.js";
import { fetchAndStoreHighScore } from "./firestore.js";

const auth = getAuth();

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    await handleLogin(email, password);
    await fetchAndStoreHighScore(auth.currentUser);
    alert("Berhasil login!");
    window.location.href = "game.html";
  } catch (error) {
    alert("Login gagal: " + error.message);
  }
});
