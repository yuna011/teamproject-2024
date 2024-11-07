import style from '../../styles/component/common/Input.module.css'
import { useState } from 'react'

type InputProps = {
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    className?: string;
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
    value,
    onChange,
    type = 'text',
    placeholder = '',
    className = '',
    onInputChange,
}: InputProps) {
    const [isValid, setIsValid] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
                className={`block w-full pb-1 text-2xl text-center text-gray-700 border-b-2 border-gray-300 outline-none ${style.input}`}
            />
            <span className={`${style.under} ${isValid ? style.active : ''}`}></span>
        </div>
    );
}