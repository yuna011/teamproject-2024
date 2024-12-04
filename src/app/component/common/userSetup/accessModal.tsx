import style from '@/app/styles/startPage/request.module.css'

// Propsの型定義
type Props = {
    access: string, // アクセスを求めているリソースの名前(例：位置情報・マイクなど)
    text: string, // モーダルに表示する追加テキスト
    modalState: { flag: boolean, page: number }, // モーダルの状態を管理するオブジェクト
    setModalState: React.Dispatch<React.SetStateAction<any>>
}

export default function AccessModal(props: Props) {
    return (
        <div className={style.background}>
            <div className={style.accessWrap}>
                {/* ヘッダテキスト */}
                <h2>“Me.”が{props.access}へのアクセスを求めています。</h2>
                {/* 追加テキスト */}
                <p>{props.text}</p>

                {/* 許可・不許可ボタン */}
                <div className={style.accessControl}>
                    {/* 許可しないボタン。今回は何も動作を書かない。 */}
                    <button className={style.no}>許可しない</button>

                    {/*  OKボタン */}
                    <button className={style.ok} onClick={() => {
                        if (props.modalState.page === 2) {
                            window.location.href = "/top/";
                            return;
                        }
                        props.setModalState({
                            ...props.modalState,
                            page: props.modalState.page + 1
                        })
                    }}>OK</button>
                </div>
            </div>
        </div >
    )
}