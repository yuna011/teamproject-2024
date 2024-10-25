// src/authListener.ts
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '../../firebaseConfig';

export function setupAuthListener() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const token = await user.getIdToken();
            Cookies.set('auth-token', token, { expires: 1 }); // トークンを保存
        } else {
            Cookies.remove('auth-token'); // ユーザーがログアウトした場合はトークンを削除
        }
    });
}