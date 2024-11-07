type Props = {
    disabled?: boolean; // 任意: 無効状態
    text: string; // 必須: 表示するテキスト
    onClick?: () => void; // 任意: クリック時の動作
    wFull?: boolean; // 任意: trueの場合横幅を最大に。
    className?: string; // 任意: 任意のクラス名を付与
};

export default function Button(props: Props) {
    const {
        disabled = false,
        onClick = () => { },
        wFull = false,
        text,
        className = ''
    } = props;

    const handleClick = () => {
        // disabledなら「無効状態です」とログに表示、disabledでなければ、任意のonClick動作を発火。
        if (disabled) {
            console.log('無効状態です');
        } else {
            onClick();
        }
    };

    // 通常のボタンクラスとdisabledクラスを定義
    const baseClass = 'py-2 px-8 rounded-full';
    const activeClass = 'bg-[#3570C6] text-white';
    const fullWidthClass = wFull ? 'mx-auto w-full' : '';
    const disabledClass = disabled ? 'cursor-not-allowed opacity-50' : '';

    // 組み合わせたクラス名
    const classNames = `
        ${baseClass} 
        ${disabled ? disabledClass : activeClass} 
        ${fullWidthClass} 
        ${className}
    `.trim();

    return (
        <button
            className={classNames}
            onClick={handleClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}