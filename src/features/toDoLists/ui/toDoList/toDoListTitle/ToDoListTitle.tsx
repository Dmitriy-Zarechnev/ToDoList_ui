import React, {memo, useCallback} from 'react'
import S from './ToDoListTitle.module.css'
import {EditableSpan} from "common/components/editableSpan/EditableSpan"
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import {RequestStatusType} from "app/model/app-reducer"
import {useActions} from "common/hooks/useActions"
import {toDoListsThunks} from '../../../model/toDoLists/todolists-reducer'

type ToDoListTitlePropsType = {
    title: string;
    entityStatus: RequestStatusType;
    toDoListID: string
}

export const ToDoListTitle = memo((props: ToDoListTitlePropsType) => {

    // Используя useAction получили callbacks в которые уже входит dispatch
    const {updateTodoLists, deleteTodoLists} = useActions(toDoListsThunks)

    // -------------- Меняем название todolist ----------------
    const changeToDoListTitle = useCallback((newTitle: string) => {
        updateTodoLists({toDoListID: props.toDoListID, title: newTitle})
    }, [props.toDoListID])

    // -------------- Удалить ToDoList ----------------
    const onClickDeleteListHandler = useCallback(() => {
        deleteTodoLists(props.toDoListID)
    }, [props.toDoListID])

    return (
        <div className={S.top}>
            <EditableSpan
                value={props.title}
                newClass={S.header}
                onChange={changeToDoListTitle}
                disabled={props.entityStatus}
            />

            <IconButton aria-label="delete"
                        onClick={onClickDeleteListHandler}
                        disabled={props.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
})

