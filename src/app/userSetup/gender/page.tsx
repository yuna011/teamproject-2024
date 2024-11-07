'use client'
import Chevron from '@/app/component/common/Chevron'

export default function gender() {
    return (
        <div className='font-bold'>
            <p className='mt-44 text-center text-3xl'>あなたの性別を<br />教えてください</p>
            <div className='flex justify-center gap-4 mt-8'>
                <p className='flex justify-center items-end w-36 h-36 pb-4 rounded-full text-center text-white bg-[#3570c6]'>男性</p>
                <p className='flex justify-center items-end w-36 h-36 pb-4 rounded-full text-center bg-gray-200'>女性</p>
            </div>
            <Chevron prevLink='/accountSetting' nextLink='/accountSetting/age' />
        </div>
    )
}