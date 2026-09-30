// src/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC68J045k2pCaKKxVewWXeqv2EOQIl6pR4',
  authDomain: 'podc-16d6b.firebaseapp.com',
  projectId: 'podc-16d6b',
  storageBucket: 'podc-16d6b.firebasestorage.app',
  messagingSenderId: '835400394180',
  appId: '1:835400394180:web:c71fb2295513c2a10af091',
};

export const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

export const authReady: Promise<User | null> = new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    resolve(user);
  });
});
