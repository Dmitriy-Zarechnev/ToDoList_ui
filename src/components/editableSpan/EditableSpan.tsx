import React, {ChangeEvent, useCallback, useState} from 'react'
import S from '../toDoList/ToDoList.module.css'
import TextField from '@mui/material/TextField'

type EditableSpan = {
    value: string
    newClass?: string
    onChange: (newTitle: string) => void
}

export const EditableSpan = React.memo((props: EditableSpan) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [editedTitle, setEditedTitle] = useState<string>('')


    const activateEditMode = useCallback(() => {
        setEditMode(true)
        setEditedTitle(props.value)
    }, [props.value])

    const activateViewMode = useCallback(() => {
        setEditMode(false)
        props.onChange(editedTitle)
    }, [editedTitle, props.onChange])

    const onChangeInputHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.currentTarget.value)
    }, [])

    return (
        editMode
            ? <TextField
                onBlur={activateViewMode}
                onChange={onChangeInputHandler}
                value={editedTitle}
                autoFocus
                variant="standard"

            />
            : <span onDoubleClick={activateEditMode}
                    className={`${S.span} ${props.newClass}`}>{props.value}</span>
    )
})

