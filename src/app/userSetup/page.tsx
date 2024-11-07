'use client'
import Button from '@/app/component/common/Button'

export default function accountSetting() {
    return(
    <div className='font-bold'>
        <div className='ml-10 mt-44'>
            <p className='w-fit px-4 py-1 rounded-2xl text-white bg-[#3570C6]'>STEP1</p>
            <p className="mt-10 text-3xl">あなたのことを<br />教えてください</p>
        </div>
        <div className='absolute bottom-0 w-full h-[400px] flex items-end justify-center rounded-t-[100px] bg-[#3570c6]'>
            <a href="/accountSetting/gender" className='mb-20 px-36 py-2 rounded-xl bg-white'>
                <Button disabled={false} text={'次へ'} onClick={() => {}} />
            </a>
        </div>
    </div>
    )
}