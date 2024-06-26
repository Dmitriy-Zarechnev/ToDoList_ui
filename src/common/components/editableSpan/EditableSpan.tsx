import React, {ChangeEvent, memo, useCallback, useState} from 'react'
import S from 'features/toDoLists/ui/toDoList/ToDoList.module.css'
import TextField from '@mui/material/TextField'
import {RequestStatusType} from 'app/model/app-reducer'

type EditableSpan = {
    value: string;
    newClass?: string;
    onChange: (newTitle: string) => void;
    disabled?: RequestStatusType;
};

export const EditableSpan = memo((props: EditableSpan) => {
    // Локальный state для изменения editMode
    const [editMode, setEditMode] = useState<boolean>(false)
    // Локальный state для изменения editedTitle
    const [editedTitle, setEditedTitle] = useState<string>('')

    // -------------- Включаем editMode и устанавливаем editedTitle = props.value ----------------
    const activateEditMode = () => {
        setEditMode(true)
        setEditedTitle(props.value)
    }

    // -------------- Отключаем editMode и отправляем editedTitle в BLL ----------------
    const activateViewMode = useCallback(() => {
        setEditMode(false)
        props.onChange(editedTitle)
    }, [editedTitle, props.onChange])

    // -------------- Меняем editedTitle и отправляем в локальный стейт ----------------
    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.currentTarget.value)
    }

    return props.disabled !== 'loading' && editMode
        ? <TextField
            onBlur={activateViewMode}
            onChange={onChangeInputHandler}
            value={editedTitle}
            autoFocus
            variant="standard"/>
        : <span onDoubleClick={activateEditMode}
                className={`${S.span} ${props.newClass}`}>
                {props.value}</span>
})
