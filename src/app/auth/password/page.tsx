export default function Signin() {
    return (
        <div className='h-screen flex flex-col justify-between text-white bg-black'>
            <div className='flex flex-col justify-center items-center flex-grow border-b border-slate-800'>
                <p className='mb-14'>
                    <img src='/images/InstagramLogo.svg' alt='Instagram Logo' />
                </p>
                <div>
                    <p className='mb-4'>
                        <input type='text' placeholder='user_name' className='w-[343px] h-11 pl-4  rounded border border-white/20 bg-[#121212]' />
                    </p>
                    <p>
                        <input type='password' placeholder='password' className='w-[343px] h-11 pl-4  rounded border border-white/20  bg-[#121212]' />
                    </p>
                </div>
                <p className='text-blue-500 mt-4 mb-8 text-right text-xs text-right w-[343px]'>Forgot password?</p>
                <p className='w-[343px] py-3 px-32 rounded text-center bg-blue-500 '>
                    <button>Log in</button>
                </p>
                <div className='flex flex-col gap-6 items-center mt-10 text-white/60'>
                    <p className='text-blue-500'>Log in with Facebook</p>
                    <p className='text-xs'>OR</p>
                    <p>Don&apos;t have an account? <span className='text-blue-500'>Sign up.</span></p>
                </div>
            </div>
            <p className='pt-3 mb-12 text-center text-xs text-white/60'>Instagram from Facebook</p>
        </div>
    )
} 