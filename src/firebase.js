import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDB9zuNzY4Cl7FC3GOVePn_Dfav6sGTNk4",
  authDomain: "instagram-clone-91ebf.firebaseapp.com",
  databaseURL: "https://instagram-clone-91ebf.firebaseio.com",
  projectId: "instagram-clone-91ebf",
  storageBucket: "instagram-clone-91ebf.appspot.com",
  messagingSenderId: "851202589364",
  appId: "1:851202589364:web:b6e5f1c09e5b711fcb4de1",
  measurementId: "G-B60Z716JTS",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
