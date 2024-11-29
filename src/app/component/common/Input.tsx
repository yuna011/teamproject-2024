import style from '../../styles/component/common/Input.module.css'
import { useState } from 'react';

type InputProps = {
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    className?: string;
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


// TODO: 理想のデータになった場合(電話番号なら11桁入力された状態)なら、underスタイルがfocus外れても消えないようにする
// 現在は電話番号のみなので、それ以外でも適切に管理できるようにしなければならないね
export default function Input({
    value,
    onChange,
    type = 'text',
    placeholder = '',
    className = '',
    onInputChange,
}: InputProps) {
    const [isValid, setIsValid] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (onInputChange) {
            onInputChange(e);
        } else {
            onChange(e.target.value);
        }
        setIsValid(newValue.replace(/\s/g, '').length === 11);
    };

    return (
        <div className={`relative ${className} ${style.wrap}`}>
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={`block text-2xl text-center text-zinc-700 bg-black outline-none ${style.input}`}
            />
            <span className={`${style.under} ${isValid ? style.active : ''}`}></span>
        </div>
    );
}