'use client'
import { useState, useEffect } from 'react';
import { get, ref, set } from 'firebase/database';
import { auth, database } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '@/app/component/common/Button';
import Input from '../component/common/Input';
import { Notification } from '../component/Notification';
import Chevron from '@/app/component/common/Chevron';
import Checkbox from '@/app/component/common/Checkbox';
import { FaLocationArrow } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FaBluetooth } from 'react-icons/fa';

// 型定義
interface UserData {
    instagramName: string;
    [key: string]: any;
}

export default function CreateAccount() {
    const [index, setIndex] = useState<number>(1);
    const [instagramName, setInstagramName] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInstagramName(uid: string) {
            const userRef = ref(database, `users/${uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val() as UserData;
                setInstagramName(userData.instagramName);
            } else {
                console.log('ユーザーデータが見つかりません');
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchInstagramName(user.uid);
            } else {
                setInstagramName(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // 3秒後にindexを更新するuseEffect
    // useEffect(() => {
    //     if (index === 0) {
    //         const timer = setTimeout(() => {
    //             setIndex((prevIndex) => prevIndex + 1);
    //         }, 3000);

    //         return () => clearTimeout(timer);
    //     }
    // }, [index]);

    const handleIndexChange = (newIndex: number) => {
        setIndex(newIndex);
    };

    return (
        <div>
            <div className='absolute bg-white top-0'>
                <h2 className="text-center font-bold text-lg">
                    現在のインデックス: {index}
                </h2>
                <div className="flex justify-center gap-2 my-4">
                    {[...Array(8)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleIndexChange(i)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </div>
            {index !== 0 && <Notification notificationApp={'メッセージ'}
                // サーバーから送られてきた認証コードを表示している。
                // notificationText={`認証コード : ${pincode.pincode}`}
                notificationText={`認証コード : 2323`}
            />}
            {index === 0 && (
                <h1 className='mt-20 ml-6 leading-10 text-3xl font-bold'>
                    ようこそ、<br />@{instagramName || 'ゲスト'}
                </h1>
            )}
            {index === 1 && <PhoneInput />}
            {index === 2 && <TermsAgreement />}
            {index === 3 && <PersonalInfoStep />}
            {index === 4 && <GenderAndAgeSelection />}
            {index === 5 && <UsernameSetup />}
            {index === 6 && <PermissionsRequest />}
            {index === 7 && <CompletionScreen />}
        </div>
    );
}

export function PhoneInput() {
    const [phoneNumber, setPhoneNumber] = useState('');

    function handlePhoneInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        // 正規表現で半角数字以外を除去
        const sanitizedValue = e.target.value.replace(/[^\d]/g, "");

        // 11桁の電話番号を "090 0000 0000" 形式に整形
        const format = (str: string) =>
            [str.slice(0, 3), str.slice(3, 7), str.slice(7, 11)].filter(Boolean).join(" ");

        // 11桁を超えないよう制限して、整形した値をセット
        setPhoneNumber(format(sanitizedValue.slice(0, 11)));
    };

    async function savePhoneNumber() {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            try {
                await set(ref(database, `users/${userId}/phoneNumber`), phoneNumber);
                console.log('電話番号が保存されました');
            } catch (error) {
                console.error('電話番号の保存に失敗しました:', error);
            }
        } else {
            console.error('ユーザーが認証されていません');
        }
    };

    return (
        <div className='mt-48 text-center px-12'>
            <h1 className='text-2xl font-bold'>電話番号を<br />入力してください</h1>
            <Input
                type="tel"
                value={phoneNumber}
                onChange={setPhoneNumber}
                onInputChange={handlePhoneInputChange}
                placeholder="080 1234 1234"
                className=' m-auto mt-14 mb-6'
            />
            <Button
                disabled={phoneNumber.replace(/\s/g, '').length !== 11} // 11桁未満なら無効
                className='font-bold text-lg'
                wFull
                text={'認証コードを受け取る'}
                onClick={() => savePhoneNumber()}
            />
        </div>
    )
}


export function TermsAgreement() {
    return (
        <div className='flex flex-col gap-10 justify-center h-screen mx-10'>
            <h1 className='mx-auto text-3xl'>利用するために</h1>
            <div>
                <Checkbox text={'エンドユーザーライセンス契約'} />
                <p className='pl-5 text-xs text-gray-400'>これには、アプリの安全性、セキュリティ機能を保証するために、「アプリ名」が「アプリ名」本体含む各機能のソフトウェアを自動的に随時更新することに同意することも含まれます。</p>
                <p className='w-fit ml-6 text-xs border-b-2 '>詳細</p>
            </div>
            <div>
                <Checkbox text={'利用規約'} />
                <p className='pl-6 text-xs text-gray-400'>これには、アプリの安全性、セキュリティ機能を保証するために、「アプリ名」が「アプリ名」本体含む各機能のソフトウェアを自動的に随時更新することに同意することも含まれます。</p>
                <p className='w-fit ml-6 text-xs border-b-2 '>詳細</p>
            </div>
            <div>
                <Checkbox text={'プライバシーポリシー'} />
                <p className='w-fit ml-6 text-xs border-b-2 '>詳細</p>
            </div>
            <div className='mx-auto border-dashed border-t-2 w-full'></div>
            <div>
                <input type='checkbox' className='mr-2' />
                <label htmlFor=''>全てに同意<span className='text-gray-400'>(任意)</span></label>
            </div>

            <a href='/accountSetting' className='w-fit mt-20 py-2 px-4 self-end rounded-3xl text-white bg-[#3570c6] '>
                <Button disabled={false} text={'同意する'} onClick={() => { }} />
            </a>
        </div>
    )
}

export function PersonalInfoStep() {
    return (
        <div className='font-bold'>
            <div className='ml-10 mt-44'>
                <p className='w-fit px-4 py-1 rounded-2xl text-white bg-[#3570C6]'>STEP1</p>
                <p className='mt-10 text-3xl'>あなたのことを<br />教えてください</p>
            </div>
            <div className='absolute bottom-0 w-full h-[400px] flex items-end justify-center rounded-t-[100px] bg-[#3570c6]'>
                <a href='/accountSetting/gender' className='mb-20 px-36 py-2 rounded-xl bg-white'>
                    <Button disabled={false} text={'次へ'} onClick={() => { }} />
                </a>
            </div>
        </div>
    )
}

export function GenderAndAgeSelection() {
    return (
        <>
            <div className='font-bold'>
                <p className='mt-44 text-center text-3xl'>あなたの性別を<br />教えてください</p>
                <div className='flex justify-center gap-4 mt-8'>
                    <p className='flex justify-center items-end w-36 h-36 pb-4 rounded-full text-center text-white bg-[#3570c6]'>男性</p>
                    <p className='flex justify-center items-end w-36 h-36 pb-4 rounded-full text-center bg-gray-200'>女性</p>
                </div>
                <Chevron prevLink='/accountSetting' nextLink='/accountSetting/age' />
            </div>
            <div className='font-bold'>
                <div className='flex justify-center gap-4 mt-24'>
                    <p className='flex justify-center items-end w-32 h-32 pb-4 rounded-full text-center text-white bg-[#3570c6]'>男性</p>
                    <p className='flex justify-center items-end w-32 h-32 pb-4 rounded-full text-center bg-gray-200'>女性</p>
                </div>
                <p className='mt-16 text-center text-3xl'>あなたの年代を<br />教えてください</p>
                <div className='mt-12 text-center'>
                    <select className='border-b-2 border-gray-400 text-center font-normal'>
                        <option>10代</option>
                        <option>20代</option>
                        <option>30代</option>
                        <option>40代</option>
                        <option>50代</option>
                        <option>60代以上</option>
                    </select>
                </div>
                <Chevron prevLink='/accountSetting/gender' nextLink='/accountSetting/name' />
            </div>
            )
        </>
    )
}

export function UsernameSetup() {
    return (
        <div className='font-bold'>
            <p className='mt-44 text-center text-3xl'>表示名を設定<br />しましょう</p>
            <div className='mt-12 px-12 text-center'>
                <input type='text' className='w-full pl-2 border-b-2 border-gray-400' />
            </div>
            <Chevron prevLink='/accountSetting/age' nextLink='/accountSetting/permit' />
        </div>
    )
}

export function PermissionsRequest() {
    return (
        <div className='font-bold'>
            <p className='mt-36 text-center text-2xl'>最後に以下を許可してください</p>
            <div className='flex flex-col gap-8 mt-12 m-4 p-4 rounded bg-gray-100'>
                <div className='flex items-center gap-4 px-4'>
                    <FaLocationArrow size={50} />
                    <div>
                        <p>位置情報の利用</p>
                        <p className='font-normal'>すれちがい機能のために必要です。権限がなくても利用できますが、誰ともすれちがえなくなります。</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 px-4'>
                    <FaBell size={50} />
                    <div>
                        <p>通知の設定</p>
                        <p className='font-normal'>すれちがいできた時、誰かがあなたにコンタクトを求めた時、その他様々なシーンでお知らせします</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 px-4'>
                    <FaBluetooth size={50} />
                    <div>
                        <p>Bluetoothの有効化</p>
                        <p className='font-normal'>GPSのみの位置情報は性格ではありません。Bluetoothの有効化によって消費する電力はごくわずかです。</p>
                    </div>
                </div>
            </div>
            <div className='w-fit mt-20 mx-auto px-36 py-2 rounded-3xl text-center text-white bg-[#3570c6] '>
                <a href='/accountSetting/fin'><Button disabled={false} text={'すすむ'} onClick={() => { }} /></a>
            </div>
        </div>
    )
}

export function CompletionScreen() {

    return (
        <div className='h-screen flex flex-col justify-center gap-28 text-center text-3xl font-bold'>
            <h1>おつかれさまでした</h1>
            <h2>すれちがいを<br />始めましょう！</h2>
            <img src='../images/woman.png' alt='' className='pr-4 w-[250px] self-end' />

        </div>
    )
}