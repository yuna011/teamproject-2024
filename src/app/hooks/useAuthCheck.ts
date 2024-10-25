'use client'

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // App Routerで使用する場合
import { auth } from '../../../firebaseConfig';

export default function useAuthCheck() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/auth'); // 認証されていない場合は/authにリダイレクト
            }
        });

        return () => unsubscribe(); // クリーンアップ
    }, [router]);
};
