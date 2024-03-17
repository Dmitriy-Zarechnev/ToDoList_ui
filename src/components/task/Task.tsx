import React, {ChangeEvent, useCallback} from 'react'
import S from './Task.module.css'
import Checkbox from '@mui/material/Checkbox'
import {EditableSpan} from '../editableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import {TasksStatuses, TasksType} from '../../api/tasks-api'


type TaskPropsType = {
    task: TasksType
    onChangeStatusHandler: (taskId: string, status: TasksStatuses) => void
    changeTaskTitle: (newTitle: string) => void
    onClickRemoveHandler: (id: string) => void
}


export const Task: React.FC<TaskPropsType> = React.memo(({
                                                             task,
                                                             onChangeStatusHandler,
                                                             changeTaskTitle,
                                                             onClickRemoveHandler
                                                         }) => {


    // -------------- Работа с изменением status ----------------
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let isDone = e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New

        onChangeStatusHandler(task.id, isDone)
    }, [task.id])


    return (
        <div className={task.status === TasksStatuses.Completed
            ? `${S.to_Do_List__list} ${S.is_done}`
            : S.to_Do_List__list}>
            <div className={S.to_Do_List__list_box}>

                <Checkbox
                    color={'success'}
                    checked={task.status === TasksStatuses.Completed}
                    onChange={onChangeHandler}
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

