import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: 'AIzaSyC_U66rAtGaGdpjmQiidqVOW6e8RX1X8Pw',
  authDomain: 'chat-web-app-cd533.firebaseapp.com',
  databaseURL: 'https://chat-web-app-cd533-default-rtdb.firebaseio.com',
  projectId: 'chat-web-app-cd533',
  storageBucket: 'chat-web-app-cd533.appspot.com',
  messagingSenderId: '627621238131',
  appId: '1:627621238131:web:26c4059c213e86a6c3a106',
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();

export const database = app.database();

