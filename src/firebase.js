import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBhuzs_vsL-x_fp3K4nVNUfkLwMMrzj_as",
  authDomain: "stackoverflow-5b9f1.firebaseapp.com",
  projectId: "stackoverflow-5b9f1",
  storageBucket: "stackoverflow-5b9f1.appspot.com",
  messagingSenderId: "798567070309",
  appId: "1:798567070309:web:09fe0b287dd528d80e248c",
  measurementId: "G-T0JNSSMDYY",
};

const firebaseApp = initializeApp(firebaseConfig);
// const db = firebaseApp.firestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider };
// export default db;
