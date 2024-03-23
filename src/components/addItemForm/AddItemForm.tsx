import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react'
import S from './Input.module.css'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import {RequestStatusType} from '../../state/reducers/app-reducer'


type AddItemFormPropsType = {
    itemType: string
    addItem: (title: string) => void
    disabled?: RequestStatusType
}


export const AddItemForm = React.memo((props: AddItemFormPropsType) => {

    // Локальный стэйт для изменения newTaskTitle
    const [newTaskTitle, setNewTaskTitle] = useState('')
    // Локальный стэйт для изменения error
    const [error, setError] = useState<string | null>(null)

    // -------------- Меняем newTaskTitle и отправляем в локальный стейт ----------------
    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    // -------------- Отправляем newTaskTitle в BLL и обнуляем newTaskTitle ----------------
    const addTaskBtnFn = () => {
        if (newTaskTitle.trim() !== '') {
            props.addItem(newTaskTitle.trim())
            setNewTaskTitle('')
        } else {
            setError(`${props.itemType}'s title is required😡!`)
        }
    }

    // -------------- Вызов addTaskBtnFn при нажатии 'Enter' ----------------
    const onKeyDownInputHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        error !== null && setError(null)

        e.key === 'Enter' && addTaskBtnFn()
    }, [])

    return (
        <>
            <div className={S.input_box}>
                <TextField
                    variant={'standard'}
                    value={newTaskTitle}
                    onChange={onChangeInputHandler}
                    onKeyDown={onKeyDownInputHandler}
                    error={!!error}
                    label={error ? error : `Add new ${props.itemType}`}
                    margin="normal"
                />
                <IconButton color="primary"
                            onClick={addTaskBtnFn}
                            disabled={props.disabled === 'loading'}
                >
                    📌</IconButton>
            </div>
        </>
    )
})

