'use client'

// UserProfileForm.tsx
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth, storage } from '../../../firebaseConfig'; // Firebaseの設定をインポート
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface UserProfile {
    username: string;
    gender: string;
    phoneNumber: string;
    ageGroup: string;
    profileImage: File | null;
}

const UserProfileForm: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        username: '',
        gender: '',
        phoneNumber: '',
        ageGroup: '',
        profileImage: null,
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProfile((prev) => ({
                ...prev,
                profileImage: e.target.files[0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('ユーザーが認証されていません');

            let profileImageUrl = '';
            if (profile.profileImage) {
                // 画像をFirebase Storageにアップロード
                const storageRef = ref(storage, `profileImages/${user.uid}`);
                await uploadBytes(storageRef, profile.profileImage);
                profileImageUrl = await getDownloadURL(storageRef);
            }

            // Firestoreにユーザープロフィールを保存
            await setDoc(doc(db, 'users', user.uid), {
                username: profile.username,
                gender: profile.gender,
                phoneNumber: profile.phoneNumber,
                ageGroup: profile.ageGroup,
                profileImageUrl,
            });

            setSuccess('プロフィールが正常に更新されました');
        } catch (error) {
            setError('プロフィールの更新に失敗しました');
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                name='username'
                placeholder='ユーザー名'
                value={profile.username}
                onChange={handleChange}
                required
            />
            <select name='gender' value={profile.gender} onChange={handleChange} required>
                <option value=''>性別を選択</option>
                <option value='male'>男性</option>
                <option value='female'>女性</option>
            </select>
            <input
                type='tel'
                name='phoneNumber'
                placeholder='電話番号'
                value={profile.phoneNumber}
                onChange={handleChange}
                required
            />
            <select name='ageGroup' value={profile.ageGroup} onChange={handleChange} required>
                <option value=''>年代を選択</option>
                <option value='10s'>10代</option>
                <option value='20s'>20代</option>
                <option value='30s'>30代</option>
                <option value='40s'>40代</option>
                <option value='50s'>50代以上</option>
            </select>
            <input type='file' name='profileImage' onChange={handleFileChange} />
            <button type='submit'>プロフィールを更新</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};

export default UserProfileForm;