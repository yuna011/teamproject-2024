"use client";

import "./globals.css";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebaseConfig';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // 認証状態の読み込み中を示す

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth'); // 認証されていない場合は/authにリダイレクト
      } else {
        setLoading(false); // 認証済みの場合に読み込みを終了
      }
    });

    return () => unsubscribe(); // クリーンアップ
  }, [router]);

  if (loading) {
    // 読み込み中のインジケーターなどを表示
    return <div>Loading...</div>;
  }

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}