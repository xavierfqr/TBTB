import firebase from "firebase";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAO7QS5o_JFFQB2M997NlBUPq3j2Pgn0DA",
    authDomain: "tobethebest-8c760.firebaseapp.com",
    projectId: "tobethebest-8c760",
    storageBucket: "tobethebest-8c760.appspot.com",
    messagingSenderId: "647319323249",
    appId: "1:647319323249:web:b86be420486c6ce74651d0",
    measurementId: "G-9JHR9L993W"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();