import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { handleRegister } from "./auth.js";

const auth = getAuth();
const db = getFirestore();

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;

  try {
    await handleRegister(email, password, username); // sudah termasuk setDoc()
    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "index.html";
  } catch (error) {
    alert("Gagal daftar: " + error.message);
  }
});