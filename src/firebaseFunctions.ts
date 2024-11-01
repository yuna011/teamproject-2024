// Firebase Authentication の認証状態を監視するための関数をインポート
import { onAuthStateChanged } from 'firebase/auth';

// クッキーの操作に使用するライブラリ js-cookie をインポート
import Cookies from 'js-cookie';

// Firebase 認証機能のインスタンスをインポート
import { auth } from '../firebaseConfig';

/**
 * 認証状態の変更を監視し、認証トークンをクッキーに保存または削除する関数
 */
export function setupAuthListener() {
    // ユーザーの認証状態が変更されるたびに実行されるリスナーを設定
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // ユーザーがログインしている場合
            // Firebase の ID トークンを取得し、サーバー側での認証に使用
            const token = await user.getIdToken();

            // クッキーに認証トークンを保存
            // 有効期限は1日、ルートパスに適用、`sameSite` を `Lax` に設定
            Cookies.set('auth-token', token, { expires: 1, path: '/', sameSite: 'Lax' });
        } else {
            // ユーザーがログアウトしている場合
            // 認証トークンをクッキーから削除
            Cookies.remove('auth-token');
        }
    });
}