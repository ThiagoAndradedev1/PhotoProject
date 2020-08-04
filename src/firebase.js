import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyC1CCdsP4SfNCz8JOf7EY18A-hfiJqNiCQ',
  authDomain: 'projeto-testeee.firebaseapp.com',
  databaseURL: 'https://projeto-testeee.firebaseio.com',
  projectId: 'projeto-testeee',
  storageBucket: 'projeto-testeee.appspot.com',
  messagingSenderId: '770981615567',
  appId: '1:770981615567:web:a0af172c3b4d42f51d24ba'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase };
