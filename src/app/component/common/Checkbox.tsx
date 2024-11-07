export default function Checkbox({ text = '' }) {
    return (
        <div>
            <input type='checkbox' className='mr-2' />
            <label>{text}</label>
        </div>
    )
}