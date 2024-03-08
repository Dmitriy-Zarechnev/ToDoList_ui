import React from 'react'
import S from './Task.module.css'
import Checkbox from '@mui/material/Checkbox'
import {EditableSpan} from '../editableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import {TasksType} from '../toDoList/ToDoList'


type TaskPropsType = {
    task: TasksType
    onChangeCheckBoxHandler: (taskId: string, isDone: boolean) => void
    changeTaskTitle: (newTitle: string) => void
    onClickRemoveHandler: (id: string) => void
}


export const Task: React.FC<TaskPropsType> = React.memo(({
                                                             task,
                                                             onChangeCheckBoxHandler,
                                                             changeTaskTitle,
                                                             onClickRemoveHandler
                                                         }) => {
    return (
        <div className={task.isDone ? `${S.to_Do_List__list} ${S.is_done}` : S.to_Do_List__list}>
            <div className={S.to_Do_List__list_box}>

                <Checkbox
                    color={'success'}
                    checked={task.isDone}
                    onChange={() =>
                        onChangeCheckBoxHandler(task.id, task.isDone)}
                />

                <EditableSpan value={task.title}
                              onChange={(newTitle) =>
                                  changeTaskTitle(newTitle)}
                />
            </div>

            <IconButton aria-label="delete" size="small"
                        onClick={() =>
                            onClickRemoveHandler(task.id)}>
                <DeleteIcon fontSize="small"/>
            </IconButton>
        </div>
    )
})

