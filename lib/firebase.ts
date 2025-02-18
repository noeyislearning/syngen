import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyAAbNhzwdamosdhNV09NiqeCEo7cgKSqUI",
  authDomain: "syngen-3edf6.firebaseapp.com",
  projectId: "syngen-3edf6",
  storageBucket: "syngen-3edf6.firebasestorage.app",
  messagingSenderId: "135688307358",
  appId: "1:135688307358:web:a75e23969eb490ad04718f",
  measurementId: "G-R9GZVNBBEN",
}

const app = initializeApp(firebaseConfig)

let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { app, analytics }
