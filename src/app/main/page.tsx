// src/app/page.tsx
'use client';
import { useEffect, useState } from 'react';

// 緯度と経度を格納する Location 型
interface Location {
    latitude: number;
    longitude: number;
}

// API レスポンスの型
interface ApiResponse {
    name?: string;
    address?: string;
    error?: string;
}

export default function Home() {
    const [location, setLocation] = useState<Location | null>(null);
    const [address, setAddress] = useState<string>('地名を取得中です...');

    useEffect(() => {
        function fetchLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });

                    try {
                        const response = await fetch(`/api/location/getPlace?lat=${latitude}&lng=${longitude}`, {
                            cache: 'no-store',
                        });
                        const data: ApiResponse = await response.json();

                        if (data.address) {
                            setAddress(data.address); // 詳細な住所を表示
                        } else if (data.error) {
                            console.error(data.error);
                            setAddress('地名情報が見つかりませんでした。');
                        }
                    } catch (e) {
                        console.error('Error fetching address:', e);
                        setAddress('地名情報の取得に失敗しました');
                    }
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
                setAddress('位置情報がサポートされていません');
            }
        };

        fetchLocation();
    }, []);

    return (
        <>
            <p>ホーム画面です</p>
            {location ? (
                <div>
                    <p>現在の座標: 緯度 {location.latitude}, 経度 {location.longitude}</p>
                    <p>現在の場所: {address}</p>
                </div>
            ) : (
                <p>位置情報を取得中です...</p>
            )}
        </>
    );
}