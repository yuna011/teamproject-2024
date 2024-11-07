// クライアントサイドで実行されることを示すディレクティブ
'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { auth } from '../../../firebaseConfig';

/**
 * AuthPage コンポーネント
 * ユーザーが新規登録またはログインを行うためのフォームを表示し、
 * 成功時には認証トークンをクッキーに保存し、/main へリダイレクトします。
 */
export default function AuthPage() {
    // 各フォーム入力フィールドの状態を管理
    const [email, setEmail] = useState(''); // メールアドレス入力
    const [password, setPassword] = useState(''); // パスワード入力
    const [isRegister, setIsRegister] = useState(true); // 新規登録モードかログインモードかを管理
    const [error, setError] = useState<string | null>(null); // エラーメッセージ
    const [success, setSuccess] = useState<string | null>(null); // 成功メッセージ
    const router = useRouter(); // ページ遷移用のフック

    /**
     * フォーム送信時の処理
     * 新規登録またはログインのいずれかの処理を実行し、成功時にクッキーを設定してリダイレクト
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // デフォルトのフォーム送信動作を無効化
        setError(null); // エラーメッセージをリセット
        setSuccess(null); // 成功メッセージをリセット

        try {
            let userCredential;
            if (isRegister) {
                // 新規登録処理
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setSuccess('ユーザー登録が成功しました。'); // 成功メッセージを表示
            } else {
                // ログイン処理
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                setSuccess('ログインに成功しました。'); // 成功メッセージを表示
            }

            // 認証トークンを取得し、クッキーに保存
            const token = await userCredential.user.getIdToken();
            Cookies.set('auth-token', token, { expires: 1, path: '/' }); // クッキーの有効期限を1日に設定

            // 成功時に /main ページへリダイレクト
            router.push('/main');
        } catch (error) {
            // エラー発生時、エラーメッセージを表示
            setError('操作に失敗しました。');
            console.error('Auth error:', error);
        }
    };

    // コンポーネントの描画内容
    return (
        <div>
            <h2>{isRegister ? 'ユーザー登録' : 'ログイン'}</h2> {/* モードに応じた見出し */}
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='メールアドレス'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // メールアドレス入力変更ハンドラ
                    required
                />
                <input
                    type='password'
                    placeholder='パスワード'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // パスワード入力変更ハンドラ
                    required
                />
                <button type='submit'>{isRegister ? '登録' : 'ログイン'}</button> {/* 登録またはログインボタン */}
            </form>
            <button onClick={() => setIsRegister(!isRegister)}> {/* モード切替ボタン */}
                {isRegister ? '既にアカウントをお持ちですか？ログインはこちら' : 'アカウントをお持ちでないですか？新規登録はこちら'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージの表示 */}
            {success && <p style={{ color: 'green' }}>{success}</p>} {/* 成功メッセージの表示 */}
        </div>
    );
}