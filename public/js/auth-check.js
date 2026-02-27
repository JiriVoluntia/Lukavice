// Ověření přihlášení - musí se spustit hned na začátku
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqdn1j6SMhLg0g0Jy0t1zsT_i9PtJIFcM",
  authDomain: "lukavice-288a6.firebaseapp.com",
  projectId: "lukavice-288a6",
  storageBucket: "lukavice-288a6.firebasestorage.app",
  messagingSenderId: "662004004122",
  appId: "1:662004004122:web:7deab3bb97700870bca8a3",
  measurementId: "G-GJYP8YRMQV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Ověření přihlášení - pokud není přihlášen, přesměruj na login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Zjisti, na jaké stránce jsme
    const currentPath = window.location.pathname;
    
    // Pokud jsme na admin stránce a nejsme přihlášeni, přesměruj na login
    if (currentPath.includes('admin')) {
      window.location.href = currentPath.includes('admin/') ? '../login.html' : 'login.html';
    }
  }
});

// Globální funkce pro logout
window.logout = async () => {
  await signOut(auth);
  window.location.href = window.location.pathname.includes('admin/') ? '../index.html' : 'index.html';
};
