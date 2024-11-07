'use client'
import Chevron from '@/app/component/common/Chevron'

export default function age() {
    return (
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
}