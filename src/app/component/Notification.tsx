// reactの機能、useStateとuseEffectをimport
import { useState, useEffect } from "react";
import style from "../styles/notification.module.css";

// Notificationコンポーネントで使用するpropsの型定義
type notification = {
    notificationApp: string,  // 通知のアプリ名
    notificationText: string  // 通知のテキスト内容
    pincode?: string; // 認証コードをオプショナルで追加
}

export function Notification(props: notification) {
    // アニメーションのための状態（trueかfalse）
    const [addClass, setAddClass] = useState(false);

    // useEffectフックを使用：Reactコンポーネントがマウント、更新、アンマウントされたときに特定の動作を実行できる
    // この例では、コンポーネントがマウントされた後に一度だけ（空の依存配列[]を指定しているため）実行される
    useEffect(() => {
        // setTimeoutで3秒後に実行される関数をセット：この関数ではaddClass状態をtrueに設定。
        // これにより、3秒後に何らかのアニメーションが開始される（CSS側でaddClassがtrueになったときのアニメーションを設定する想定）
        const timer = setTimeout(() => {
            setAddClass(true);
        }, 3000);

        // useEffectでreturnされる関数は、コンポーネントがアンマウントされたときに実行される（クリーンアップ関数と呼ばれる）
        // この例では、クリーンアップ関数でsetTimeoutのタイマーをクリアしています。これにより不要な動作を防ぐ
        return () => clearTimeout(timer);
    }, []); // 依存配列が空なので、このuseEffectはコンポーネントがマウントされた後に一度だけ実行される

    // JSXを返す（UIの構造を定義）
    return (
        <>
            {/* addClassがtrueならアニメーションのクラスを追加 */}
            <div className={addClass ? style.animation + ' ' + style.notification : style.notification}>
                {/* 通知のヘッダー */}
                <div className={style.notificationHeader}>
                    <div className={style.notificationApp}>
                        {/* 通知のアプリ名を表示 */}
                        <h3>{props.notificationApp}</h3>
                    </div>
                    {/* 通知の時間（この例では"たった今"と固定） */}
                    <p className={style.notificationTime}>たった今</p>
                </div>
                {/* 通知の本文 */}
                <div className={style.notificationContents}>
                    {/* 通知のテキストを表示 */}
                    <p className={style.notificationText}>{props.notificationText}{props.pincode}</p>
                </div>
            </div>
        </>
    );
}
