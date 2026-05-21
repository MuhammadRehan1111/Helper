// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBhXSDZrxn6WIbueeJhhksqLemiezimiZc',
  authDomain: 'helper-33e75.firebaseapp.com',
  databaseURL: 'https://helper-33e75-default-rtdb.firebaseio.com',
  projectId: 'helper-33e75',
  storageBucket: 'helper-33e75.firebasestorage.app',
  messagingSenderId: '74329062596',
  appId: '1:74329062596:web:PLACEHOLDER', // optional placeholder
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
