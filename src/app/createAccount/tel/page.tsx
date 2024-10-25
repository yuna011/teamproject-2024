export default function CreateAccount() {
    return (
        <div className="mt-20 text-xl text-center font-bold">
            <h1 className="text-[32px] leading-10">電話番号を<br />入力してください</h1>
            <p className="border-b-4 w-fit m-auto mt-[60px] mb-[40px] text-center">
                <input type="tel" />
            </p>
            <p>
                <button className="w-[294px] h-[39px] text-white rounded-xl bg-[#3570c6]">認証コードを受け取る</button>
            </p>
        </div>
    )
} 