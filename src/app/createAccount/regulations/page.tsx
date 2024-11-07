'use client'
import Button from '@/app/component/common/Button'
import Checkbox from '@/app/component/common/Checkbox'

export default function Regulations() {
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