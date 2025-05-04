import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const db = getFirestore();

export const fetchAndStoreHighScore = async (user) => {
  if (!user) return;

  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const highscore = userData.highScore || 0;
    localStorage.setItem("highscore", highscore);
  } else {
    localStorage.setItem("highscore", 0);
  }
};
