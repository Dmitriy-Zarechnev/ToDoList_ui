import React, {ChangeEvent, useCallback} from 'react'
import S from './Task.module.css'
import Checkbox from '@mui/material/Checkbox'
import {EditableSpan} from '../editableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import {TasksStatuses, TasksType} from '../../api/tasks-api'
import {RequestStatusType} from '../../state/app-reducer'


type TaskPropsType = {
    task: TasksType
    onChangeStatusHandler: (taskId: string, status: TasksStatuses) => void
    changeTaskTitle: (newTitle: string) => void
    onClickRemoveHandler: (id: string) => void
    entityStatus: RequestStatusType
}


export const Task: React.FC<TaskPropsType> = React.memo(({
                                                             task,
                                                             onChangeStatusHandler,
                                                             changeTaskTitle,
                                                             onClickRemoveHandler,
                                                             entityStatus
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
                    disabled={entityStatus === 'loading'}
                />

                <EditableSpan value={task.title}
                              onChange={(newTitle) =>
                                  changeTaskTitle(newTitle)}
                              disabled={entityStatus}/>
            </div>

            <IconButton aria-label="delete" size="small"
                        onClick={() =>
                            onClickRemoveHandler(task.id)}
                        disabled={entityStatus === 'loading'}
            >
                <DeleteIcon fontSize="small"/>
            </IconButton>
        </div>
    )
})

