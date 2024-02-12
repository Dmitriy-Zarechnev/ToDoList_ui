import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import S from './Input.module.css'
import {IconButton, TextField} from '@mui/material'


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
        if (e.key === 'Enter') {
            addTaskBtnFn()
        }
    }

    return (
        <>
            <div className={S.input_box}>
                <TextField
                    variant={'outlined'}
                    value={newTaskTitle}
                    onChange={onChangeInputHandler}
                    onKeyDown={onKeyDownInputHandler}
                    error={!!error}
                    helperText={error}
                    label={`Add new ${props.itemType}`}

                />
                <IconButton color="primary" onClick={addTaskBtnFn}>📌</IconButton>
            </div>
        </>
    )
}

