// Firebase SDK の各機能をインポート
import { initializeApp } from 'firebase/app'; // Firebase アプリの初期化
import { getFirestore } from 'firebase/firestore'; // Cloud Firestore データベースの使用
import { getAuth } from 'firebase/auth'; // Firebase 認証機能の使用
import { getStorage } from 'firebase/storage'; // Firebase Storage の使用

// Firebase プロジェクトの設定オブジェクト
const firebaseConfig = {
    apiKey: 'AIzaSyA-rqL_AtvjJ9Id7lLBQHHeXGXxrxvJUmw',          // ウェブ API キー (Firebase コンソールから取得)
    authDomain: 'im-ningning.firebaseapp.com',                 // 認証ドメイン (プロジェクト ID + firebaseapp.com)
    projectId: 'im-ningning',                                  // プロジェクト ID (Firebase プロジェクトの識別子)
    storageBucket: 'im-ningning.firebasestorage.app',          // Storage バケットの URL (プロジェクト ID + firebasestorage.app)
    messagingSenderId: '815279119318',                         // メッセージング送信者 ID (プロジェクト番号)
    appId: '1:815279119318:web:a82d2994f7a9ea301ae277'         // アプリケーション ID (Firebase から提供される一意の ID)
};

// Firebase アプリを初期化し、プロジェクトの設定を適用
const app = initializeApp(firebaseConfig);

// Firestore データベースの初期化とエクスポート
const db = getFirestore(app); // Firestore を使ってデータベース操作を行うためのインスタンス

// Firebase 認証の初期化とエクスポート
const auth = getAuth(app); // Firebase 認証機能のインスタンス。ユーザーのログインやログアウトに利用

// Firebase Storage の初期化とエクスポート
const storage = getStorage(app); // Cloud Storage を使用するためのインスタンス。ファイルのアップロードやダウンロードに使用

// 他のファイルから db, auth, storage を使用できるようにエクスポート
export { db, auth, storage };