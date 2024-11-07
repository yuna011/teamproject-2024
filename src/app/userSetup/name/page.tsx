'use client'
import Chevron from '@/app/component/common/Chevron'

export default function name() {
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