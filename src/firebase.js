import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDCdptm8xJJe4RGoL2GnxCiNi0rlZ5rMKk",
    authDomain: "instagram-clone-3ff6b.firebaseapp.com",
    projectId: "instagram-clone-3ff6b",
    storageBucket: "instagram-clone-3ff6b.appspot.com",
    messagingSenderId: "884029789125",
    appId: "1:884029789125:web:14b827b9302f65a4eef1ac",
    measurementId: "G-MV1JGFNGMQ"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { auth, storage };
  export default db;