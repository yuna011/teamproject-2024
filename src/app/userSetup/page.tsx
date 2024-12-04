'use client'
import { useState, useEffect, useRef, ChangeEvent, RefObject } from 'react';
import style from '@/app/styles/primereact.module.css'
import { auth, database } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '@/app/component/common/Button';
import SignInButton from '@/app/component/common/userSetup/signInButton';
import { Notification } from '../component/Notification';
import { get, ref, set } from 'firebase/database';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { FaLocationArrow, FaBell, FaBluetooth, FaInstagram, FaApple } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import Image from 'next/image';
import AccessModal from '@/app/component/common/userSetup/accessModal'

type WelcomePageProps = {
    onWelcomePage: () => void;
};

type SigninProps = {
    onSignin: () => void;
};

type UserData = {
    instagramName: string;
    [key: string]: string;
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

type PersonalInfoStepProps = {
    onPersonalInfoStep: () => void;
};

type GenderAndAgeSelectionProps = {
    onGenderAndAgeSelection: () => void;
};

type UsernameSetupProps = {
    onUsernameSetup: () => void;
    instagramName: string | null;
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
        setIndex(4);
        setNotificationVisible(true); // 新しいコード生成で通知を表示
    };

    function handlePhoneNumberSubmit(number: string) {
        setPhoneNumber(number);
    };

    // デバッグ用
    // function handleIndexChange(newIndex: number) {
    //     setIndex(newIndex);
    // };

    // 3秒後にindexを更新するuseEffect
    useEffect(() => {
        if (index === 2) {
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
            {/* <div className='absolute bg-white top-0 opacity-50 z-10'>
                <h2 className="text-center font-bold text-lg text-black">
                    現在のインデックス: {index}
                </h2>
                <div className="flex justify-center gap-2 my-4">
                    {[...Array(9)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleIndexChange(i)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </div> */}
            {notificationVisible && (
                <Notification
                    notificationApp="メッセージ"
                    notificationText={`認証コード : ${pincode}`}
                />
            )}
            {index === 0 && <WelcomePage onWelcomePage={nextPage} />}
            {index === 1 && <Signin onSignin={nextPage} />}
            {index === 2 && (
                <div >
                    <Image src="/images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' width={50} height={50} />
                    <h1 className='mt-12 ml-6 leading-10 text-2xl font-bold'>
                        Welcome<br />@{instagramName || 'ゲスト'}
                    </h1>
                </div>
            )}
            {index === 3 && (
                <PhoneInput onCodeGenerated={handleCodeGenerated} onPhoneNumberSubmit={handlePhoneNumberSubmit} />
            )}
            {index === 4 && (
                <VerificationCodeInput
                    phoneNumber={phoneNumber}
                    pincode={pincode}
                    onCodeRegenerated={handleCodeGenerated}
                    onVerificationSuccess={nextPage}
                />
            )}
            {index === 5 && <PersonalInfoStep onPersonalInfoStep={nextPage} />}
            {index === 6 && <GenderAndAgeSelection onGenderAndAgeSelection={nextPage} />}
            {index === 7 && <UsernameSetup onUsernameSetup={nextPage} instagramName={instagramName} />}
            {index === 8 && <PermissionsRequest />}
            {index === 9 && <CompletionScreen />}
        </div>
    );
}


export function WelcomePage(props: WelcomePageProps) {
    const [animationComplete, setAnimationComplete] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 1000);
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
                <Image
                    src="/images/Me..svg"
                    alt="Me."
                    width={50}
                    height={50}
                />
            </div>
            <div
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 ${animationComplete ? 'opacity-1 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <p className="mb-52 leading-8">
                    瞬間でつながる、新しい出会い。
                    <br />
                    あなたの生活に寄り添うリストを、
                    <br />
                    どこへ行ってもシェアしよう。
                </p>
                <div className="flex flex-col gap-4">
                    <SignInButton
                        className='text-[#222] bg-white'
                        text='Sign in with Apple'
                        icon={<FaApple />}
                    >
                    </SignInButton>
                    <SignInButton
                        text='Sign in with Google'
                        icon={<FcGoogle className="w-5 h-5 p-0.5 bg-white rounded-full" />}
                        className='bg-[#5d83e5]'
                    >
                    </SignInButton>
                    <SignInButton
                        text='Sign in with Instagram'
                        onClick={() => props.onWelcomePage()}
                        icon={<FaInstagram />}
                        className='bg-gradient-to-r from-[#8e39a7] via-[#fd1e1e] to-[#fbae44]'
                    ></SignInButton>
                </div>
                <p className="mt-4 text-xs underline">Sign up with your email</p>
                <p className="mt-8 text-xs text-zinc-400">
                    &copy; 2024 I&apos;m not ningning All Rights Reserved.
                </p>
            </div>
        </div >
    );
}

export function Signin(props: SigninProps) {
    return (
        <div className='h-screen flex flex-col justify-between text-white bg-black'>
            <div className='flex flex-col justify-center items-center flex-grow border-b border-slate-800'>
                <p className='mb-14'>
                    <Image src='/images/InstagramLogo.svg' alt='InstagramLogo' width={180} height={30} />
                </p>
                <Image
                    src="/images/account.jpg"
                    alt="説明テキスト"
                    width={100}
                    height={100}
                    className='rounded-full'
                />
                <p className='m-3'>ryota11_07</p>

                {/* ここでしか青いボタンは登場しないのでコンポーネント化しないことにします */}
                <button
                    onClick={() => props.onSignin()}
                    className='py-2 text-white block w-4/5 rounded bg-[#3797EF]'
                >Log in</button>

                <p className='mt-6 text-[#3797EF]'>Switch accounts</p>
            </div>
            <p className='pt-3 mb-12 text-center  text-xs text-white/60'>Don&apos;t have an account? <span className='text-white'>Sign up.</span></p>
        </div>
    )
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
            <Image src="/images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' width={50} height={50} />
            <div className='mt-24 text-center px-12'>
                <h2 className='text-lg mb-8'>create your account using your <br />phone number</h2>
                <div className='flex items-center justify-center mt-14'>
                    <p className='border rounded py-1 px-2 border-zinc-500 whitespace-nowrap'>🇯🇵 +81</p>

                    <input type="text" value={phoneNumber}
                        onChange={(e) => handlePhoneInputChange(e)}
                        className=' block bg-transparent text-[#fff] focus:outline-none text-xl w-2/4 ml-8 placeholder-zinc-400'
                        placeholder="Phone number" />
                </div>
                <div className="w-[327px] fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8">
                    <p className='mb-2 text-[9px] text-zinc-400'>By tapping &quot;Continue&quot;, you agree to our Privacy Policy and Terms of Service</p>
                    <Button
                        disabled={phoneNumber.replace(/\s/g, '').length !== 11}
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
                    className="mt-4 text-xs text-zinc-600"
                >
                    Didn&apos;t receive the code?<span className='pl-1 text-zinc-400 underline'>Resend now.</span>
                </button>
            </div>
        </div>
    );
}

export function PersonalInfoStep(props: PersonalInfoStepProps) {
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
                onClick={() => props.onPersonalInfoStep()}
            />
        </div>
    )
}

export function GenderAndAgeSelection(props: GenderAndAgeSelectionProps) {
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
            <Image src="/images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' width={50} height={50} />
            <p className='mt-24 text-center text-lg'>Select your gender.</p>
            <div className='flex justify-center gap-4 mt-8'>
                <p
                    className={`flex flex-col justify-center items-center w-36 h-36 rounded-full border border-gray-600 cursor-pointer transition-all duration-300 ease-in-out transform  ${selectedGender === '男性' ? 'text-black bg-white' : 'bg-black'}`}
                    onClick={() => handleGenderSelect('男性')}
                >
                    <span>man</span> {/* 文字を表示 */}
                    <Image
                        src="/images/man.svg"
                        alt="man"
                        className="w-16 h-16 mt-4"
                        style={{
                            filter: selectedGender === '男性' ? 'invert(1)' : 'none',
                        }}
                        width={80}
                        height={80}
                    />
                </p>
                <p
                    className={`flex flex-col justify-center items-center w-36 h-36 rounded-full border border-gray-600 cursor-pointer transition-all duration-300 ease-in-out transform ${selectedGender === '女性' ? 'text-black bg-white' : 'bg-black'}`}
                    onClick={() => handleGenderSelect('女性')}
                >
                    <span>woman</span>
                    <Image
                        src="/images/woman.svg"
                        alt="woman"
                        className="w-16 h-16 mt-4"
                        style={{
                            filter: selectedGender === '女性' ? 'invert(1)' : 'none',
                        }}
                        width={80}
                        height={80}
                    />
                </p>
            </div>

            <div className='mt-12 text-center'>
                <p className='mb-4'>Select your age group.</p>
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
                onClick={() => props.onGenderAndAgeSelection()}
            />
        </div>
    );
}

export function UsernameSetup(props: UsernameSetupProps) {

    const handleButtonClick = () => {
        // setInputValue(`@${props.instagramName || 'ゲスト'}`);
        setInputValue(`綾太`)
        setImagePath('/images/account.jpg');
        setClassName('mx-auto mt-8 rounded-full')
    };
    const [inputValue, setInputValue] = useState('');
    const [imagePath, setImagePath] = useState('/images/userIcon.svg')
    const [className, setClassName] = useState('mx-auto mt-8');

    return (
        <div>
            <Image src="/images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' width={50} height={50} />
            <p className='mt-24 text-center text-lg font-bold'>Let&apos;s set up your Profile</p>
            <Image src={imagePath} alt="" className={className} width={80} height={80} />
            <div className='mt-8 px-12 text-center'>
                <input
                    type='text'
                    placeholder='user name'
                    value={inputValue}
                    readOnly
                    className='w-full mt-4 pl-2 text-center text-xl font-bold border-b-2 border-zinc-400 bg-black text-white focus:outline-none placeholder-zinc-400 font-normal'
                />
            </div>

            <div className='w-fit mx-auto mt-8 px-4 flex gap-2 items-center text-black rounded-xl bg-white'>
                <FaInstagram />
                <Button
                    disabled={false}
                    className="w-fit font-normal"
                    text="Use the same as Instagram"
                    onClick={handleButtonClick}
                />
            </div>

            <Button
                disabled={false}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-8"
                text="Next"
                onClick={() => props.onUsernameSetup()}
            />
        </div>
    )
}

export function PermissionsRequest() {
    // モーダル、というか権限の許可を求めてくるアレ。
    const [modalState, setModalState] = useState({
        flag: false, // モーダルは表示状態か？
        page: 0 // フロント都合の番号
    });

    // モーダルに表示するテキスト
    const [modalMessage, setModalMessage] = useState({
        access: '', // なんの権限にアクセスする？
        text: '' // 詳細なテキスト
    })

    useEffect(() => {
        switch (modalState.page) {
            case 0:
                setModalMessage({
                    access: '位置情報',
                    text: 'すれちがい検出やユーザー同士の位置情報の共有に利用します。'
                });
                break;
            case 1:
                setModalMessage({
                    access: '通知',
                    text: 'すれちがい時やその他の通知をお知らせします。'
                });
                break;
            case 2:
                setModalMessage({
                    access: 'Bluetooth',
                    text: '正確な位置情報の把握に使用します。'
                });
                break;
            default:
                setModalMessage({
                    access: 'デフォルトメッセージ',
                    text: 'これが表示されるということは...? なにかおかしいね。'
                });
                break;
        }
    }, [modalState])

    return (
        <div>
            <Image src="/images/Me..svg" alt="" className='w-10 h-10 mx-auto mt-12' width={50} height={50} />
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
                        <p className='mt-2 text-sm'>GPSのみの位置情報は正確ではありません。Bluetoothの有効化によって消費する電力はごくわずかです。</p>
                    </div>
                </div>
            </div>
            <Button
                disabled={false}
                text='Continue'
                onClick={() => {
                    // props.onPermissionsRequest()
                    setModalState({ flag: true, page: 0 })
                }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-8"
            />
            {modalState.flag &&
                <AccessModal
                    modalState={modalState} setModalState={setModalState}
                    access={modalMessage.access} text={modalMessage.text}
                />
            }
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