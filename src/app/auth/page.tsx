'use client';

import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { auth, database } from '../../../firebaseConfig';

interface UserData {
    ageGroup: string;
    gender: string;
    instagramName: string;
    phoneNumber: string;
    profileImage: string;
    userName: string;
    [key: string]: string;
}

export default function AuthPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isRegister, setIsRegister] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [inputValues, setInputValues] = useState<UserData>({
        ageGroup: '',
        gender: '',
        instagramName: '',
        phoneNumber: '',
        profileImage: '',
        userName: ''
    });

    useEffect(() => {
        const fetchUserData = async (currentUser: User | null) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userSnapshot = await get(ref(database, `users/${currentUser.uid}`));
                    if (userSnapshot.exists()) {
                        const data = userSnapshot.val() as UserData;
                        setUserData(data);
                        setInputValues(data);
                    } else {
                        console.log('ユーザーデータが存在しません');
                    }
                } catch (error) {
                    console.error('データの取得に失敗しました:', error);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, fetchUserData);
        return () => unsubscribe();
    }, []);

    const handleUpdateField = async (field: keyof UserData) => {
        if (user) {
            try {
                const userRef = ref(database, `users/${user.uid}`);
                await update(userRef, { [field]: inputValues[field] });
                alert(`${field}が更新されました！`);
                setUserData((prevData) => prevData ? { ...prevData, [field]: inputValues[field] } : prevData);
            } catch (error) {
                console.error(`Failed to update ${field}:`, error);
                alert(`${field}の更新に失敗しました。`);
            }
        }
    };

    const handleInputChange = (field: keyof UserData, value: string) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            let userCredential;
            if (isRegister) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;
                await set(ref(database, `users/${uid}`), { ...inputValues });
                setSuccess('ユーザー登録が成功しました。');
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                setSuccess('ログインに成功しました。');
            }

            const token = await userCredential.user.getIdToken();
            Cookies.set('auth-token', token, { expires: 1, path: '/' });
            // router.push('/main'); // リダイレクト先が必要な場合有効化
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
                    type='email'
                    placeholder='メールアドレス'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type='password'
                    placeholder='パスワード'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type='submit'>{isRegister ? '登録' : 'ログイン'}</button>
            </form>
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? '既にアカウントをお持ちですか？ログインはこちら' : 'アカウントをお持ちでないですか？新規登録はこちら'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <div style={{ border: '1px solid #000', padding: '16px', margin: '16px 0' }}>
                <h2>テスト画面 - ログインユーザー情報とDB更新</h2>
                {user ? (
                    <>
                        <p>ユーザーID: {user.uid}</p>
                        <p>メールアドレス: {user.email}</p>
                        <h3>データベースのユーザーデータ:</h3>
                        {userData ? (
                            <pre>{JSON.stringify(userData, null, 2)}</pre>
                        ) : (
                            <p>データを取得中...</p>
                        )}

                        <h3>DBの各フィールドを更新</h3>
                        {Object.keys(inputValues).map((field) => (
                            <div key={field} style={{ marginBottom: '8px' }}>
                                <label>
                                    {field}:
                                    <input
                                        type="text"
                                        placeholder={`${field}を入力`}
                                        value={inputValues[field as keyof UserData]}
                                        onChange={(e) => handleInputChange(field as keyof UserData, e.target.value)}
                                    />
                                </label>
                                <button onClick={() => handleUpdateField(field as keyof UserData)}>更新</button>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>ユーザーがログインしていません。</p>
                )}
            </div>
        </div>
    );
}