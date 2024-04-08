import React, {memo} from 'react'
import S from '../ToDoList.module.css'
import {Task} from '../../task/Task'
import {FilterValuesType} from '../../../model/toDoLists/todolists-reducer'
import {TasksStatuses} from '../../../../../utils/api/enums'
import {tasksSelector} from '../../../model/tasks/tasks-selector'
import {useSelector} from 'react-redux'

type TasksPropsType = {
    toDoListID: string
    filter: FilterValuesType
}

export const Tasks = memo((props: TasksPropsType) => {
    // Получили tasks из state используя хук - useSelector и selector - tasksSelector
    const tasks = useSelector(tasksSelector)


    // -------------- Фильтрация Tasks ----------------
    const tasksForToDoList = tasks[props.toDoListID].filter(task => {
        switch (props.filter) {
            case 'active':
                return task.status === TasksStatuses.New
            case 'completed':
                return task.status === TasksStatuses.Completed
            default:
                return true // Если фильтр не указан, вернуть все tasks
        }
    })


    // -------------- Text для span, когда нет tasks ----------------
    const noTasksText = props.filter === 'active' ? 'No active tasks'
        : props.filter === 'completed' ? 'No completed tasks' : 'No tasks'

    return (
        <div className={S.to_Do_List__lists}>
            {tasksForToDoList.map((el) => {
                return (
                    <Task
                        key={el.id}
                        task={el}
                        toDoListID={props.toDoListID}
                        entityStatus={el.entityTaskStatus}
                    />
                )
            })}
            {tasksForToDoList.length === 0 && (
                <span className={S.no_tasks}>{noTasksText}</span>
            )}
        </div>
    )
})

