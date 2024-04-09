import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react'
import S from './AddItemForm.module.css'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import {RequestStatusType} from 'app/model/app-reducer'

type AddItemFormPropsType = {
    itemType: string;
    addItem: (title: string) => Promise<any>;
    disabled?: RequestStatusType;

};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
        // Локальный state для изменения newTaskTitle
        const [newTaskTitle, setNewTaskTitle] = useState('')
        // Локальный state для изменения error
        const [error, setError] = useState<string | null>(null)

        // -------------- Меняем newTaskTitle и отправляем в локальный стейт ----------------
        const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
            if (error && error.length > 0) return setError(null)
            setNewTaskTitle(e.currentTarget.value)
        }

        // -------------- Отправляем newTaskTitle в BLL и обнуляем newTaskTitle ----------------
        const addTaskBtnFn = () => {
            if (newTaskTitle.trim() !== '') {

                props.addItem(newTaskTitle.trim())
                    .then(() => {
                        setNewTaskTitle('')
                        setError(null)
                    })
                    .catch((error) => {
                            if (error?.resultCode) {
                                // Вывели ошибку локально
                                setError(error.messages[0])
                            }
                        }
                    )

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
                    <IconButton color="primary" onClick={addTaskBtnFn} disabled={props.disabled === 'loading'}>
                        📌
                    </IconButton>
                </div>
            </>
        )
    }
)
