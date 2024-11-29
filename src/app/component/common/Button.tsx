type Props = {
    disabled?: boolean; // 任意: 無効状態
    text: string; // 必須: 表示するテキスト
    onClick?: () => void; // 任意: クリック時の動作
    wFull?: boolean; // 任意: trueの場合横幅を最大に。
    className?: string; // 任意: 任意のクラス名を付与
    inversion?: boolean // 任意: カラーを反転させる時true
};

export default function Button(props: Props) {
    const {
        disabled = false,
        onClick = () => { },
        wFull = false,
        text,
        className = '',
        inversion = false,
    } = props;

    function handleClick() {
        if (disabled) {
            console.log('無効状態です');
        } else {
            onClick();
        }
    };

    // ボタンの基本クラス
    const baseClass = 'w-[327px] py-2 text-black font-bold rounded bg-[#fff]';
    const fullWidthClass = wFull ? 'mx-auto w-full' : '';

    // 通常時と反転時のスタイルクラス
    const activeClass = inversion ? 'bg-white text-[#fff]' : 'bg-[#000]';
    const disabledClass = 'cursor-not-allowed opacity-50';

    // 組み合わせたクラス名
    const classNames = `
        ${baseClass} 
        ${disabled ? `${disabledClass} ${activeClass}` : activeClass} 
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