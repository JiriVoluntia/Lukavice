import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCqdn1j6SMhLg0g0Jy0t1zsT_i9PtJIFcM",
  authDomain: "lukavice-288a6.firebaseapp.com",
  projectId: "lukavice-288a6",
  storageBucket: "lukavice-288a6.firebasestorage.app",
  messagingSenderId: "662004004122",
  appId: "1:662004004122:web:7deab3bb97700870bca8a3",
  measurementId: "G-GJYP8YRMQV"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
