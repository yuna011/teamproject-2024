// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA-rqL_AtvjJ9Id7lLBQHHeXGXxrxvJUmw",  // ウェブ API キー
    authDomain: "im-ningning.firebaseapp.com",        // authDomain（プロジェクトIDに.firebaseapp.comを追加）
    projectId: "im-ningning",                         // プロジェクト ID
    storageBucket: "im-ningning.appspot.com",         // storageBucket（プロジェクトIDに.appspot.comを追加）
    messagingSenderId: "815279119318",                // プロジェクト番号
    appId: "YOUR_APP_ID"                              // appIdはFirebaseコンソールから確認（この項目はまだ見つからない場合もあります）
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };