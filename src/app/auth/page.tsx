'use client'

// AuthForm.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // useRouterをインポート
import { auth } from '../../../firebaseConfig';

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(true); // 登録モードかログインモードかを切り替える
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter(); // useRouterフックを使用

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            if (isRegister) {
                // 新規登録
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setSuccess('ユーザー登録が成功しました。');
                console.log('Registered user:', userCredential.user);
            } else {
                // ログイン
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                setSuccess('ログインに成功しました。');
                console.log('Logged in user:', userCredential.user);
            }

            // 成功した場合に /profile へリダイレクト
            router.push('/profile');
        } catch (error) {
            setError('操作に失敗しました。');
            console.error('Auth error:', error);
        }
    };

    return (
        <div>
            <h2>{isRegister ? 'ユーザー登録' : 'ログイン'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegister ? '登録' : 'ログイン'}</button>
            </form>
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? '既にアカウントをお持ちですか？ログインはこちら' : 'アカウントをお持ちでないですか？新規登録はこちら'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default AuthForm;