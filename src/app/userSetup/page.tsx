'use client'
import { useState, useEffect, useRef, ChangeEvent, RefObject } from 'react';
import checkboxStyle from '../styles/checkbox.module.css';
import style from '@/app/styles/primereact.module.css'
import { auth, database } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '@/app/component/common/Button';
import Input from '../component/common/Input';
import { Notification } from '../component/Notification';
import { get, ref, set } from 'firebase/database';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { FaLocationArrow, FaBell, FaBluetooth, FaInstagram, FaApple } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";


type UserData = {
    instagramName: string;
    [key: string]: any;
};

type VerificationCodeInputProps = {
    phoneNumber: string;
    pincode: string; // サーバーからの認証用PINコード
    onVerificationSuccess: () => void; // 認証成功時のコールバック
    onCodeRegenerated: (newCode: string) => void;
};

type PhoneInputProps = {
    onCodeGenerated: (code: string) => void;
    onPhoneNumberSubmit: (phoneNumber: string) => void;
};

type WelcomePageProps = {
    onWelcomePage: () => void;
};


export default function CreateAccount() {
    const [index, setIndex] = useState<number>(0);
    const [instagramName, setInstagramName] = useState<string | null>(null);
    const [pincode, setPincode] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [notificationVisible, setNotificationVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchInstagramName = async (uid: string) => {
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

    // ページネーションを司る関数。
    function nextPage(nextIndex?: number) {
        if (nextIndex !== undefined) {
            setIndex(nextIndex);
        } else {
            setIndex((prevIndex) => prevIndex + 1);
        }
    };

    function handleCodeGenerated(code: string) {
        setPincode(code);
        setIndex(2);
        setNotificationVisible(true); // 新しいコード生成で通知を表示
    };

    function handlePhoneNumberSubmit(number: string) {
        setPhoneNumber(number);
    };

    // デバッグ用
    function handleIndexChange(newIndex: number) {
        setIndex(newIndex);
    };

    // 3秒後にindexを更新するuseEffect
    useEffect(() => {
        if (index === 0) {
            const timer = setTimeout(() => {
                setIndex((prevIndex) => prevIndex + 1);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [index]);

    useEffect(() => {
        if (notificationVisible) {
            const timer = setTimeout(() => setNotificationVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationVisible]);

    return (
        <div>
            {/* アニメーションつけたらページ変更できないので一時的にz-indexを入れてます */}
            <div className='absolute bg-white top-0 opacity-50 z-10'>
                <h2 className="text-center font-bold text-lg text-black">
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
            {notificationVisible && (
                <Notification
                    notificationApp="メッセージ"
                    notificationText={`認証コード : ${pincode}`}
                />
            )}
            {index === 0 && <WelcomePage onWelcomePage={nextPage} />}
            {index === 1 && (
                <div >
                    <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
                    <h1 className='mt-12 ml-6 leading-10 text-2xl font-bold'>
                        Welcome<br />@{instagramName || 'ゲスト'}
                    </h1>
                </div>
            )}
            {index === 2 && (
                <PhoneInput onCodeGenerated={handleCodeGenerated} onPhoneNumberSubmit={handlePhoneNumberSubmit} />
            )}
            {index === 3 && (
                <VerificationCodeInput
                    phoneNumber={phoneNumber}
                    pincode={pincode}
                    onCodeRegenerated={handleCodeGenerated}
                    onVerificationSuccess={nextPage}
                />
            )}
            {index === 4 && <PersonalInfoStep />}
            {index === 5 && <GenderAndAgeSelection />}
            {index === 6 && <UsernameSetup />}
            {index === 7 && <PermissionsRequest />}
            {index === 8 && <CompletionScreen />}
        </div>
    );
}


export function WelcomePage(props: WelcomePageProps) {
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 1500); // 1秒後にアニメーションを開始
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative text-center" style={{ minHeight: '100vh' }}>
            <div
                className={`h-screen flex justify-center items-center transition-all duration-1000 ${animationComplete ? 'pointer-events-auto' : 'pointer-events-auto'
                    }`}
                style={{
                    transform: animationComplete ? 'translateY(-30%)' : 'translateY(0)',
                }}
            >
                <img
                    src="../images/Me..svg"
                    alt="Me."
                />
            </div>
            <div
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 ${animationComplete ? 'opacity-1 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <p className="mb-24 leading-8">
                    瞬間でつながる、新しい出会い。
                    <br />
                    あなたの生活に寄り添うリストを、
                    <br />
                    どこへ行ってもシェアしよう。
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        className="w-[327px] mx-auto py-3 flex justify-center items-center gap-2 text-[#222] rounded bg-white pointer-events-none"
                        aria-label="Appleでサインイン"
                    >
                        <FaApple />
                        <p>Sign in with Apple</p>
                    </button>
                    <button
                        className="w-[327px] mx-auto py-3 flex justify-center items-center gap-2 rounded bg-[#5d83e5]"
                        aria-label="Googleでサインイン"
                    >
                        <FcGoogle className="w-5 h-5 p-0.5 bg-white rounded-full" />
                        <p>Sign in with Google</p>
                    </button>
                    <button
                        className="w-[327px] mx-auto py-3 flex justify-center items-center gap-2 font-bold rounded bg-gradient-to-r from-[#8e39a7] via-[#fd1e1e] to-[#fbae44]"
                        aria-label="Instagramで続行"
                    >
                        <FaInstagram />
                        <p>Instagramで続行</p>
                    </button>
                </div>
                <p className="mt-4 text-xs underline">Sign up with your email</p>
                <p className="mt-8 text-xs text-gray-400">
                    ©️ 2024 Im not ningnign All Rights Reserved.
                </p>
            </div>
        </div>
    );
}

export function PhoneInput({ onCodeGenerated, onPhoneNumberSubmit }: PhoneInputProps) {
    const [phoneNumber, setPhoneNumber] = useState('');

    function handlePhoneInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const sanitizedValue = e.target.value.replace(/[^\d]/g, "");
        const format = (str: string) =>
            [str.slice(0, 3), str.slice(3, 7), str.slice(7, 11)].filter(Boolean).join(" ");
        setPhoneNumber(format(sanitizedValue.slice(0, 11)));
    };

    const savePhoneNumber = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (userId) {
                await set(ref(database, `users/${userId}/phoneNumber`), phoneNumber);
                console.log('電話番号が保存されました');

                const response = await axios.post('/api/pincode/generatePincode');
                const { randomCode } = response.data;
                onCodeGenerated(randomCode);
                onPhoneNumberSubmit(phoneNumber);
            }
        } catch (error) {
            console.error('電話番号の保存またはPIN生成に失敗しました:', error);
        }
    };

    return (
        <div>
            <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
            <div className='mt-24 text-center px-12'>
                <h2 className='text-lg mb-8'>create your account using your <br />phone number</h2>
                <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    onInputChange={handlePhoneInputChange}
                    placeholder="Phone number"
                    className='m-auto mt-14 mb-6'
                />
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8">
                    <p className='mb-2 text-[9px] text-gray-400'>By tapping "Continue", you agree to our Privacy Policy and Terms of Service</p>
                    <Button
                        disabled={phoneNumber.replace(/\s/g, '').length !== 11}
                        // className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
                        wFull
                        text={'Continue'}
                        onClick={savePhoneNumber}
                    />
                </div>
            </div>
        </div>
    );
}

export function VerificationCodeInput({
    phoneNumber,
    pincode,
    onVerificationSuccess,
    onCodeRegenerated
}: VerificationCodeInputProps) {
    const ref1 = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);
    const ref3 = useRef<HTMLInputElement>(null);
    const ref4 = useRef<HTMLInputElement>(null);

    const refs: RefObject<HTMLInputElement>[] = [ref1, ref2, ref3, ref4];
    const [code, setCode] = useState<string[]>(["", "", "", ""]);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        ref1.current?.focus();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value.length === 1 && index < 3 && refs[index + 1].current) {
            refs[index + 1].current!.focus();
        } else if (value.length === 0 && index > 0 && refs[index - 1].current) {
            refs[index - 1].current!.focus();
        }

        if (newCode.join("").length === 4) {
            if (newCode.join("") === pincode) {
                setTimeout(() => {
                    onVerificationSuccess();
                    setIsError(false); // 新しいコードが生成されたらエラーメッセージをリセット
                }, 2000); // 2秒待機
            } else {
                setTimeout(() => {
                    setIsError(true);
                    console.error('認証コードが違います');
                }, 2000); // 2秒待機
            }
        }
    };

    const regenerateCode = async () => {
        try {
            const response = await axios.post('/api/pincode/generatePincode');
            const { randomCode } = response.data;
            onCodeRegenerated(randomCode);
            setIsError(false);
        } catch (error) {
            setIsError(true);
            console.error('認証コードの再生成に失敗しました:', error);
        }
    };

    return (
        <div>
            <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
            <div className="mt-24 text-center px-12">
                <h2 className="text-lg">Please enter the verification code<br />sent to your phone</h2>
                {isError && <p className='mt-4 text-[#00abc2] font-bold'>Authentication code is wrong!</p>}
                <div className="flex justify-center mt-8 space-x-2">
                    {refs.map((ref, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={ref}
                            value={code[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            className="w-12 h-12 text-xl text-center border-b-2 border-gray-400 bg-black focus:outline-none"
                        />
                    ))}
                </div>
                <button
                    onClick={regenerateCode}
                    className="mt-4 text-xs text-gray-600"
                >
                    Didn't receive the code?<span className='pl-1 text-gray-500 underline'>Resend now.</span>
                </button>
            </div>
        </div>
    );
}

export function PersonalInfoStep() {
    return (
        <div>
            <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
            <h1 className='mt-24 text-center leading-8'>
                登録と認証が完了しました。<br />
                あなたの素晴らしいプロフィールを<br />
                是非教えてください。
            </h1>
            <Button
                disabled={false}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-8"
                text="OK"
                onClick={() => { }}
            />
        </div>
    )
}

export function GenderAndAgeSelection() {
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const ageOptions = [
        { label: '10代', value: '10代' },
        { label: '20代', value: '20代' },
        { label: '30代', value: '30代' },
        { label: '40代', value: '40代' },
        { label: '50代', value: '50代' },
        { label: '60代以上', value: '60代以上' },
    ];

    return (
        <div className='font-bold'>
            <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
            <p className='mt-24 text-center text-lg'>Select your gender.</p>
            <div className='flex justify-center gap-4 mt-8'>
                <p
                    className={`flex flex-col justify-center items-center w-36 h-36 rounded-full border border-gray-600 cursor-pointer transition-all duration-300 ease-in-out transform  ${selectedGender === '男性' ? 'text-black bg-white' : 'bg-black'}`}
                    onClick={() => handleGenderSelect('男性')}
                >
                    <span>man</span> {/* 文字を表示 */}
                    <img
                        src="../images/man.svg"
                        alt="man"
                        className="w-16 h-16 mt-4"
                    />
                </p>
                <p
                    className={`flex flex-col justify-center items-center w-36 h-36 rounded-full border border-gray-600 cursor-pointer transition-all duration-300 ease-in-out transform ${selectedGender === '女性' ? 'text-black bg-white' : 'bg-black'}`}
                    onClick={() => handleGenderSelect('女性')}
                >
                    <span>woman</span>
                    <img
                        src="../images/woman.svg"
                        alt="woman"
                        className={`w-16 h-16 mt-4`}
                    />
                </p>
            </div>

            <div className='mt-12 text-center'>
                <p>Select your age group.</p>
                <Dropdown
                    value={selectedAgeGroup}
                    options={ageOptions}
                    onChange={(e) => setSelectedAgeGroup(e.value)}
                    placeholder="20代"
                    // TODO importを使って無理やり幅をつけているが年齢選択後の見た目がビミョー。
                    className={style.gender}
                />
            </div>
            <Button
                disabled={false}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-8"
                text="Next"
                onClick={() => { }}
            />
        </div>
    );
}

export function UsernameSetup() {
    return (
        <div>
            <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
            <p className='mt-24 text-center text-lg font-bold'>Let's set up your Profile</p>
            <img src="../images/userIcon.svg" alt="" className='mx-auto mt-8' />
            <div className='mt-8 px-12 text-center'>
                <input type='text' placeholder='user name' className='w-full pl-2 text-center text-2xl font-bold border-b-2 border-gray-400 bg-black' />
                {/* <Input > */}
            </div>
            <div className='w-fit mx-auto mt-8 py-1 px-6 flex gap-2 items-center text-black rounded-xl bg-white'>
                <FaInstagram />
                <p>Use the same as Instagram</p>
            </div>
            <Button
                disabled={false}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-8"
                text="Next"
                onClick={() => { }}
            />
        </div>
    )
}

export function PermissionsRequest() {
    return (
        <div>
            <img src="../images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' />
            <p className='mt-8 text-center'>お疲れ様でした</p>
            <p className='mt-8 text-center'>最後に以下を許可して<br />すれちがい通信を楽しみましょう！</p>
            <div className='flex flex-col gap-8 mt-12 m-4 p-4 rounded bg-white/20 '>
                <div className='flex items-center gap-4 px-4'>
                    <FaLocationArrow size={50} />
                    <div>
                        <p>位置情報の利用</p>
                        <p className='mt-2 text-sm'>すれちがい機能のために必要です。権限がなくても利用できますが、誰ともすれちがえなくなります。</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 px-4'>
                    <FaBell size={50} />
                    <div>
                        <p>通知の設定</p>
                        <p className='mt-2 text-sm'>すれちがいできた時、誰かがあなたにコンタクトを求めた時、その他様々なシーンでお知らせします</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 px-4'>
                    <FaBluetooth size={50} />
                    <div>
                        <p>Bluetoothの有効化</p>
                        <p className='mt-2 text-sm'>GPSのみの位置情報は性格ではありません。Bluetoothの有効化によって消費する電力はごくわずかです。</p>
                    </div>
                </div>
            </div>
            <Button
                disabled={false}
                text='Continue'
                onClick={() => { }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-8"
            />
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