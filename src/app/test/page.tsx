'use client'

import style from '../styles/samples/common.module.css'
import { useState, useReducer, useEffect } from 'react'
import { countReducer } from './reducer'

function Test01() {
    // 全てに共通: 関数や機能の実装はそれぞれのコンポーネント内で行う。↓

    // まず必要なtypeを宣言。typeフォルダーなどに作るのが基本かな。
    type userInformationType = {
        mail: string,
        pass: string
    }

    // 宣言した型を使用して、安全性を高める。
    // このstateはユーザーが操作できるinputの情報を保持するためのstate。
    const [userInfo, setUserInfo] = useState<userInformationType>({
        mail: '', // string(文字列)での初期値は '' or '' 。undefinedやnullはstringではないから。
        pass: ''
    })

    // このstateはユーザーが入力した情報のuserInfoを参照し、得た情報を表示するstate。
    // 今見たらuserInfoと分ける必要ないね
    const [view, setView] = useState<userInformationType>({
        mail: '',
        pass: ''
    })

    const handleInput = (e: string, kind: string) => {
        switch (kind) {
            // switch case文でmailかpassかを分けてsetState。defaultはどのcase文にも当てはまらなかった場合の操作。
            case 'mail':
                setUserInfo({
                    ...userInfo,
                    mail: e
                })
                break
            case 'pass':
                setUserInfo({
                    ...userInfo,
                    pass: e
                })
                break
            default: userInfo
        }
    }

    return (
        <div>
            <h2>01.state,setStateを用いたinputタグを作成しよう</h2>
            <div className={style.conditions}>
                <ul>
                    <li>「結果出力」をクリックしたら、ユーザーの入力した情報を画面に出力する。</li>
                </ul>
            </div>

            <input type='text' id={'mail'} value={userInfo.mail} onChange={(e) => {
                handleInput(e.target.value, 'mail')
            }} placeholder='メールアドレス' />

            {/* 本当はパスワード欄なら type='pass'であるべきだが、今回は値の確認したいのでこのままで良い。 */}
            <input type='text' id={'pass'} value={userInfo.pass} onChange={(e) => {
                handleInput(e.target.value, 'pass')
            }} placeholder='パスワード' />

            <button onClick={() => {
                setView({
                    ...view,
                    mail: userInfo.mail,
                    pass: userInfo.pass
                })
            }}>結果出力</button>

            <p>メールアドレス:{view.mail}</p>
            <p>パスワード:{view.pass}</p>
        </div>
    )
}

function Test02() {
    type todoType = {
        text: string,
        list: string[] // 文字列の配列。['banana', 'apple']など。
    }

    const [todo, setTodo] = useState<todoType>({
        text: '',
        list: [] // 初期値に''を用いると、配列0番目に''が存在し、1以降に配列が追加される。値を追加した際['', '追加した値']となり、0番目が意図せず配列に含まれてしまう。
        // 型を明示してあげていれば、初期は[]のみでOK、型を明示せず[]を用いると、never[]になってしまい一切の配列操作を受け付けなくなる。詳細はnotion参照。
    })

    return (
        <div>
            <h2>state,setStateを用いたtodoリスト Re</h2>
            <div className={style.conditions}>
                <ul>
                    <li>todoリストの中身は配列で管理する。</li>
                    <li>出力には、ul liタグを使用し、mapで描画する。</li>
                    <li>それぞれに削除ボタンもつけ、追加・削除ができるように。</li>
                    <li>追加ボタンをクリック後、inputタグの中身が空になるようにする。</li>
                </ul>
            </div>

            <input type='text' id={'mail'} value={todo.text} onChange={(e) => {
                setTodo({
                    ...todo,
                    text: e.target.value
                })
            }} placeholder='todoを入力' />
            <button
                disabled={todo.text === ''}
                onClick={() => {
                    setTodo({
                        ...todo,
                        text: '',
                        list: [...todo.list, todo.text]
                    })
                }}>追加！</button>

            <p>todoリスト↓</p>
            <ul>
                {todo.list.map((list, idx) => (
                    <li key={idx}>{list} <button onClick={() => {
                        // deleteするボタン
                        setTodo({
                            ...todo,
                            list: todo.list.filter((_, i) => i !== idx)
                        })

                    }}>削除</button></li>
                ))}
            </ul>
        </div>
    )
}

function Test03() {
    // stateの名前・型も考えよう。このままでは良くないな。
    const [count, countDispatch] = useReducer(countReducer, 0)

    return (
        <div>
            <h2>reducerを用いたstateの変更</h2>

            <p>現在の値は{count}です。</p>
            <button onClick={() => {
                countDispatch({ type: 'PLUS' })
            }}>+1する</button>
            <button onClick={() => {
                countDispatch({ type: 'MINUS' })
            }}>-1する</button>
            <button onClick={() => {
                countDispatch({ type: 'RESET' })
            }}>reset</button>
        </div>
    )
}

function Test04() {
    // modal要素の表示を切り替えるのは、「モーダルが見えている・見えていない」の2択。boolean( true or false )が最適。
    // 初期値はfalse(見えていない)状態がしっくりくるね。
    const [isShowModal, setIsShowModal] = useState<boolean>(false)

    return (
        <div>
            <h2>stateを用いた「表示・非表示」の切り替え - modal</h2>
            <div className={style.conditions}>
                <ul>
                    <li>ボタンをクリックしたら表示されるモーダルウィンドウを作成する。</li>
                    <li>modalの外側をクリックしたら閉じるように実装。</li>
                    <li>描画するmodalや、その他のスタイルは自分で実装する</li>
                </ul>
            </div>
            <button onClick={() => { setIsShowModal(true) }}>modal表示</button>

            {/* 「isShowModalがtrueの時...」 を省略して && を用いる。 */}
            {isShowModal && <>
                <div style={{
                    background: '#000000aa',
                    width: '100%',
                    height: '100vh',
                    position: 'fixed',
                    inset: 0,
                    cursor: 'pointer'
                }}
                    onClick={() => { setIsShowModal(false) }}>
                </div>
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    margin: 'auto',
                    background: '#fff',
                    width: '60%',
                    height: '60%',
                    borderRadius: '6px'
                }}></div>
            </>}
        </div>
    )
}

function Test05() {
    return (
        <div>
            <h2>実際に使用するコンポーネント</h2>
            <div className={style.conditions}>
                <ul>
                    <li>無効状態の切り替え / クリック時の機能 / 表示されるテキスト / 任意のclassName / アクセントカラーの文字・背景の切り替え</li>
                    <li>上記4つの機能を持ったbuttonコンポーネントを作成する。</li>
                    <li>どのようにこのコンポーネントが使用されるか？をしっかり考えた上で実装する。</li>

                </ul>
            </div>
            <Button text='tintin' accent='text' />
        </div>
    )
}

type buttonProps = {
    disabled?: boolean,  // 任意: 無効状態の切り替え
    onClick?: () => void,  // 任意: クリック時の動作
    className?: string, // 任意: class名
    text: string,  // 必須: 表示されるテキスト
    accent?: 'text',  // これなんだったな？
}

function Button({ disabled, onClick, className, text, accent }: buttonProps) {
    // buttonコンポーネントの実装はここで行う。
    //　必要に応じて、propsの設定も忘れずに。
    return (
        <button disabled={disabled} onClick={onClick} className={accent === 'text' ? className + ' ' + style.componentButton : className}>{text}</button>
    )
}

function Test06() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log(`現在の値は${count}だ！`);
    }, [count])

    // useEffectは第二引数がどうなっているかで動作タイミングが変わる。
    // 第二引数にcountが存在している。この場合、countに変更があればuseEffectはその度に発火する。

    return (
        <div>
            <h2>06.useEffect</h2>
            <div className={style.conditions}>
                <ul>
                    <li>useEffectを使って,countの値が更新されるたびに、console.logでcountを表示する。</li>
                    <li>text05で作成したButtonコンポーネントを使って、countを更新する。</li>
                </ul>
            </div>
            <p>{count}</p>
            <Button text={'+1'} onClick={() => setCount(count + 1)} />
        </div>
    )
}

export default function Main() {
    return (
        <div className={style.wrap}>
            <header><h1>Homework</h1></header>
            <div>
                <h2>全てに共通したルール</h2>
                <div className={style.conditions} style={{ marginBottom: 0 }}>
                    <p>横幅の表示が崩れているのは、全画面共通でスマホ前提としたスタイルをつけているから。</p>
                    <ul>
                        <li>型が明示されていないstate、変数・定数は用いない。
                            <p>わざわざTsを使うメリットがなくなるから。</p>
                        </li>
                        <li>classNameはmodule.cssを用いた形式で記述する。</li>
                        <li>配列操作において、破壊的なメソッド<small>(push,popなど。詳細はnotionのreact tsページを参照)</small>はそのまま用いない。</li>
                    </ul>
                </div>
            </div>
            {/* componentは同一ファイル内に作ることは基本ない
            なぜか: component化するということは、他のページでも汎用的に使うことが目的であるはずだから、componentsフォルダーなどに作る。
            */}
            <Test01 />
            <Test02 />
            <Test03 />
            <Test04 />
            <Test05 />
            <Test06 />
        </div>
    )
}