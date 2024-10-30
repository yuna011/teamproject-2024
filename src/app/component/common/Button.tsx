'use client'

import style from '../../styles/component/common/Button.module.css'
type props = {
    disabled: boolean,
    text: string,
    onClick: () => void;
}


export default function Button(props: props) {
    const handleClick = () => {
        props.onClick()
    }

    return (
        <button className={style.button} onClick={handleClick}>{props.text}</button>
    )
}