import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBgw4symSSqu3IEIu1dv21cgkswSSonP6E",
  authDomain: "blog-app-1332c.firebaseapp.com",
  projectId: "blog-app-1332c",
  storageBucket: "blog-app-1332c.firebasestorage.app",
  messagingSenderId: "526431247971",
  appId: "1:526431247971:web:8c54b54e6ff3cd8278e256",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
export default app;
