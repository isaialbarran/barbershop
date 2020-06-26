import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAuGo2Z_ju45dCW9dStYW9iB1dq-jdz338',
  authDomain: 'tenedores-12c42.firebaseapp.com',
  databaseURL: 'https://tenedores-12c42.firebaseio.com',
  projectId: 'tenedores-12c42',
  storageBucket: 'tenedores-12c42.appspot.com',
  messagingSenderId: '197682079418',
  appId: '1:197682079418:web:cc506c6b5d648d5609c483',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
