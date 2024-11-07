'use client'
import { useState, useEffect, useRef, ChangeEvent, RefObject } from 'react';
import { get, ref, set } from 'firebase/database';
import axios from 'axios';
import { auth, database } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '@/app/component/common/Button';
import Input from '../component/common/Input';
import { Notification } from '../component/Notification';
import Chevron from '@/app/component/common/Chevron';
import { FaLocationArrow } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FaBluetooth } from 'react-icons/fa';
import Checkbox from '../styles/checkbox.module.css';


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

type TermsAgreementProps = {
    onTermsAgreement: () => void;
}

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

    const handleCodeGenerated = (code: string) => {
        setPincode(code);
        setIndex(2);
        setNotificationVisible(true); // 新しいコード生成で通知を表示
    };

    const handlePhoneNumberSubmit = (number: string) => {
        setPhoneNumber(number);
    };

    const handleVerificationSuccess = () => {
        setIndex(3); // 認証成功時に次の画面に進む
    };

    const handleCodeRegenerated = (newCode: string) => {
        setPincode(newCode);
        setNotificationVisible(true); // 新しいコード生成で通知を再表示
    };

    const handleTermsAgreement = () => {
        setIndex(4)
    }

    const handleIndexChange = (newIndex: number) => {
        setIndex(newIndex);
    };

    // 3秒後にindexを更新するuseEffect
    // useEffect(() => {
    //     if (index === 0) {
    //         const timer = setTimeout(() => {
    //             setIndex((prevIndex) => prevIndex + 1);
    //         }, 3000);

    //         return () => clearTimeout(timer);
    //     }
    // }, [index]);

    useEffect(() => {
        if (notificationVisible) {
            const timer = setTimeout(() => setNotificationVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationVisible]);

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
            {notificationVisible && (
                <Notification
                    notificationApp="メッセージ"
                    notificationText={`認証コード : ${pincode}`}
                />
            )}
            {index === 0 && (
                <h1 className='mt-20 ml-6 leading-10 text-3xl font-bold'>
                    ようこそ、<br />@{instagramName || 'ゲスト'}
                </h1>
            )}
            {index === 1 && (
                <PhoneInput onCodeGenerated={handleCodeGenerated} onPhoneNumberSubmit={handlePhoneNumberSubmit} />
            )}
            {index === 2 && (
                <VerificationCodeInput
                    phoneNumber={phoneNumber}
                    pincode={pincode}
                    onVerificationSuccess={handleVerificationSuccess}
                    onCodeRegenerated={handleCodeRegenerated}
                />
            )}
            {index === 3 && <TermsAgreement onTermsAgreement={handleTermsAgreement} />}
            {index === 4 && <PersonalInfoStep />}
            {index === 5 && <GenderAndAgeSelection />}
            {index === 6 && <UsernameSetup />}
            {index === 7 && <PermissionsRequest />}
            {index === 8 && <CompletionScreen />}
        </div>
    );
}

export function PhoneInput({ onCodeGenerated, onPhoneNumberSubmit }: PhoneInputProps) {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className='mt-48 text-center px-12'>
            <h2 className='text-2xl font-bold'>電話番号を<br />入力してください</h2>
            <Input
                type="tel"
                value={phoneNumber}
                onChange={setPhoneNumber}
                onInputChange={handlePhoneInputChange}
                placeholder="080 1234 1234"
                className='m-auto mt-14 mb-6'
            />
            <Button
                disabled={phoneNumber.replace(/\s/g, '').length !== 11}
                className='font-bold text-lg'
                wFull
                text={'認証コードを受け取る'}
                onClick={savePhoneNumber}
            />
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
    const [code, setCode] = useState(["", "", "", ""]);

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
                }, 2000); // 2秒待機
            } else {
                console.error('認証コードが違います');
            }
        }
    };

    const regenerateCode = async () => {
        try {
            const response = await axios.post('/api/pincode/generatePincode');
            const { randomCode } = response.data;
            onCodeRegenerated(randomCode);
        } catch (error) {
            console.error('認証コードの再生成に失敗しました:', error);
        }
    };

    return (
        <div className="mt-48 text-center px-12">
            <h2 className="text-2xl font-bold">認証コードを入力</h2>
            <p className="my-6 text-gray-600">
                {phoneNumber}にSMSで送信された<br />
                4桁の認証コードを入力してください。
            </p>
            <div className="flex justify-center mt-4 space-x-2">
                {refs.map((ref, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={ref}
                        value={code[index]}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-12 h-12 text-xl text-center border-b-2 border-gray-300 focus:outline-none"
                    />
                ))}
            </div>
            <button
                onClick={regenerateCode}
                className="mt-8 text-sm text-blue-500 underline font-bold"
            >
                認証コードを再送信する
            </button>
        </div>



    );
}

type AgreementItemProps = {
    text: string;
    description?: string;
    optional?: boolean;
    isChecked: boolean;
    onCheckChange: (checked: boolean) => void;
};

function AgreementItem({ text, description, optional, isChecked, onCheckChange }: AgreementItemProps) {
    const handleCheckboxClick = () => {
        onCheckChange(!isChecked);
    };

    return (
        <div className="flex">
            {/* カスタムチェックボックス */}
            <div className='h-full'>
                <div
                    className={`w-[18px] h-[18px] duration-75 mt-[3px] relative rounded-full cursor-pointer ${isChecked ? 'bg-[#3570C6] ' : 'border-[1.5px]'}`}
                    onClick={handleCheckboxClick}
                >
                    {isChecked && <div className={`absolute inset-0 m-auto w-[10px] h-[10px] rounded-full ${Checkbox.mark}`}></div>}
                </div>
            </div>
            <div className="grow pl-4">
                <p className="text-lg">
                    {text}
                    {optional && <span className="text-sm text-gray-500 ml-1">(任意)</span>}
                </p>
                {description && <p className="text-xs text-[#BBBBBB] mt-1">{description}</p>}
                <p className="w-fit mt-1 text-xs border-b border-black cursor-pointer font-bold">詳細</p>
            </div>
        </div>
    );
}


export function TermsAgreement(props: TermsAgreementProps) {
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState({
        license: false,
        terms: false,
        privacy: false,
        diagnostics: false,
    });

    const handleAllCheckChange = () => {
        const newCheckState = !allChecked;
        setAllChecked(newCheckState);
        setCheckedItems({
            license: newCheckState,
            terms: newCheckState,
            privacy: newCheckState,
            diagnostics: newCheckState,
        });
    };

    const handleIndividualCheckChange = (key: keyof typeof checkedItems, checked: boolean) => {
        setCheckedItems((prev) => ({ ...prev, [key]: checked }));
        setAllChecked(Object.values({ ...checkedItems, [key]: checked }).every(Boolean));
    };

    return (
        <div className="flex flex-col gap-6 justify-center h-screen mx-10 mt-16">
            <h1 className="mx-auto text-3xl mb-4">利用するために</h1>
            <AgreementItem
                text="エンドユーザーライセンス契約"
                description="これには、アプリの安全性、セキュリティ機能を保証するために、「アプリ名」が「アプリ名」本体含む各機能のソフトウェアを自動的に随時更新することに同意することも含まれます。"
                isChecked={checkedItems.license}
                onCheckChange={(checked) => handleIndividualCheckChange('license', checked)}
            />
            <AgreementItem
                text="利用規約"
                description="これには、アプリの安全性、セキュリティ機能を保証するために、「アプリ名」が「アプリ名」本体含む各機能のソフトウェアを自動的に随時更新することに同意することも含まれます。"
                isChecked={checkedItems.terms}
                onCheckChange={(checked) => handleIndividualCheckChange('terms', checked)}
            />
            <AgreementItem
                text="プライバシーポリシー"
                isChecked={checkedItems.privacy}
                onCheckChange={(checked) => handleIndividualCheckChange('privacy', checked)}
            />
            <AgreementItem
                text="診断データの送信"
                optional
                isChecked={checkedItems.diagnostics}
                onCheckChange={(checked) => handleIndividualCheckChange('diagnostics', checked)}
            />
            <div className="mx-auto border-dashed border-t-2 w-full my-6"></div>
            <div className="flex items-center">
                <div
                    className={`w-[18px] h-[18px] duration-75 relative rounded-full cursor-pointer ${allChecked ? 'bg-[#3570C6]' : 'border-[1.5px]'}`}
                    onClick={handleAllCheckChange}
                >
                    {allChecked && <div className={`absolute inset-0 m-auto w-[10px] h-[10px] rounded-full ${Checkbox.mark}`}></div>}
                </div>
                <label htmlFor="" className="ml-2 cursor-pointer">
                    全てに同意<span className="text-sm text-gray-500 ml-1">(任意)</span>
                </label>
            </div>
            <Button disabled={!(checkedItems.license && checkedItems.terms && checkedItems.privacy)} className='w-fit mt-12 py-2 px-4 self-end' text="同意する" onClick={() => { props.onTermsAgreement() }} />
        </div>
    );
}

export function PersonalInfoStep() {
    return (
        <div className='font-bold overflow-hidden'>
            <div className='ml-10 mt-44'>
                <p className='w-fit px-4 py-1 rounded-2xl text-white bg-[#3570C6]'>STEP1</p>
                <p className='mt-10 text-3xl'>あなたのことを<br />教えてください</p>
            </div>
            <div className='fixed bottom-[-12rem] w-full aspect-square flex items-end justify-center rounded-full scale-150 bg-[#3570c6]'>
            </div>
            <Button text={'次へ'} onClick={() => { }} />
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