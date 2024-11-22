import { ReactNode } from 'react';

type props = {
    text: string; // 必須: 表示するテキスト
    onClick?: () => void; // 任意: クリック時の動作
    className?: string; // 任意: 任意のクラス名を付与
    icon?: ReactNode; // 任意: アイコン要素
}

export default function SignInButton(props: props) {
    const {
        onClick = () => { },
        text,
        className,
        icon
    } = props;

    function handleClick() {
        onClick();
    };

    // ボタンの基本クラス
    const baseClass = `w-[327px] py-2 flex justify-center items-center gap-2 rounded-lg ${className}`;

    return (
        <button className={baseClass} onClick={handleClick}>
            {icon && <span>{icon}</span>} {/* アイコンを表示 */}
            {text}</button>
    )
}