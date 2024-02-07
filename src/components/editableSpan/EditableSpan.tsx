import React, {ChangeEvent, useState} from 'react'
import S from '../toDoList/ToDoList.module.css'

type EditableSpan = {
    value: string
    newClass?: string
    onChange: (newTitle: string) => void
}

export const EditableSpan = (props: EditableSpan) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [editedTitle, setEditedTitle] = useState<string>('')


    function activateEditMode() {
        setEditMode(true)
        setEditedTitle(props.value)
    }

    function activateViewMode() {
        setEditMode(false)
        props.onChange(editedTitle)
    }

    function onChangeInputHandler(e: ChangeEvent<HTMLInputElement>) {
        setEditedTitle(e.currentTarget.value)
    }

    return (
        editMode
            ? <input onBlur={activateViewMode}
                     onChange={onChangeInputHandler}
                     value={editedTitle}
                     autoFocus/>
            : <span onDoubleClick={activateEditMode}
                    className={`${S.span} ${props.newClass}`}>{props.value}</span>
    )
}

