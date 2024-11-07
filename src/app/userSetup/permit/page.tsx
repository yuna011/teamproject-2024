'use client'
import Button from '@/app/component/common/Button'
import { FaLocationArrow } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FaBluetooth } from 'react-icons/fa';

export default function permit() {
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