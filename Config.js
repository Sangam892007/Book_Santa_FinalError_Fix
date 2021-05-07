import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyAetsyOsXjUXevtnwrxJs-nD7ZKyTHBxV0",
  authDomain: "book-santa-ac2f0.firebaseapp.com",
  projectId: "book-santa-ac2f0",
  storageBucket: "book-santa-ac2f0.appspot.com",
  messagingSenderId: "749682532076",
  appId: "1:749682532076:web:a94f93ac3ab29c29c50fc9"
};
  
  if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();
