// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpOlQL-992NCA_vsPTpKTr605eIbRWCRc",
  authDomain: "kasir-pintar-29ca2.firebaseapp.com",
  projectId: "kasir-pintar-29ca2",
  storageBucket: "kasir-pintar-29ca2.appspot.com", // ❗ WAJIB .appspot.com
  messagingSenderId: "993231963046",
  appId: "1:993231963046:web:ecf506818f2f78a11c0567",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ INI YANG KEMARIN HILANG
