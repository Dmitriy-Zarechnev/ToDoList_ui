import React from 'react'
import S from './Button.module.css'
import {FilterValuesType} from '../../state/todolists-reducer'

type ButtonPropsType = {
    name: string,
    onClick: () => void,
    filter?: FilterValuesType
}

export const Button = (props: ButtonPropsType) => {
    return (
        <button
            onClick={props.onClick}
            className={props.filter === props.name ? `${S.button} ${S.active_filter}` : S.button}
        >
            {props.name}
        </button>
    )
}

