import React, {ChangeEvent, useState, KeyboardEvent} from 'react'
import S from './Input.module.css'
import {Button} from '../button/Button'

type InputPropsType = {
    itemType: string
    addItem: (title: string) => void
}


export const Input = (props: InputPropsType) => {

    let [newTaskTitle, setNewTaskTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const addTaskBtnFn = () => {
        if (newTaskTitle.trim() !== '') {
            props.addItem(newTaskTitle.trim())
            setNewTaskTitle('')
        } else {
            setError(`${props.itemType}'s title is required😡!`)
        }
    }

    const onKeyDownInputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') addTaskBtnFn()
    }

    return (
        <>
            <div className={S.input_box}>
                <input
                    value={newTaskTitle}
                    onChange={onChangeInputHandler}
                    onKeyDown={onKeyDownInputHandler}
                    className={error ? `${S.input} ${S.error}` : S.input}
                    placeholder={`Add new ${props.itemType}`}
                    maxLength={15}
                />

                <Button name={'📌'} onClick={addTaskBtnFn}/>

            </div>
            {error && <div className={S.error_message}>{error}</div>}
            {newTaskTitle.length === 15 && <div className={S.limit_message}>Letters limit reached😥!</div>}
        </>
    )
}

