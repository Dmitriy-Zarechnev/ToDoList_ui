import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react'
import S from './Input.module.css'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'


type AddItemFormPropsType = {
    itemType: string
    addItem: (title: string) => void
}


export const AddItemForm = React.memo((props: AddItemFormPropsType) => {

    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

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
                <IconButton color="primary" onClick={addTaskBtnFn}>📌</IconButton>
            </div>
        </>
    )
})

