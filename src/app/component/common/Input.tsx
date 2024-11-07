import style from '../../styles/component/common/Input.module.css'

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onInputChange) {
            onInputChange(e);
        } else {
            onChange(e.target.value);
        }
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
            <span className={`${style.under}`}></span>
        </div>
    );
}