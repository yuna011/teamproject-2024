
export default function Signin() {
  return (
    <div className='h-screen flex flex-col justify-between text-white bg-black'>
      <div className='flex flex-col justify-center items-center flex-grow border-b border-slate-800'>
        <p className='mb-14'>
          <img src='/images/InstagramLogo.svg' alt='InstagramLogo' />
        </p>
        <p>
          <img src='/images/account.jpg' alt='Account' />
        </p>
        <p className='m-3'>ryota11_07</p>
        <p className='w-[343px]  py-3 px-32 rounded text-center bg-blue-500 '>
          <button
          >Log in</button>
        </p>
        <p className='mt-6 text-blue-500'>Switch accounts</p>
      </div>
      <p className='pt-3 mb-12 text-center  text-xs text-white/60'>Don't have an account? <span className='text-white'>Sign up.</span></p>
    </div>
  )
} 