import React, {memo, useCallback, useEffect} from 'react'
import S from './ToDoList.module.css'
import {AddItemForm} from '../../../../components/addItemForm/AddItemForm'
import {EditableSpan} from '../../../../components/editableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import {Task} from '../task/Task'
import {useSelector} from 'react-redux'
import {FilterValuesType, toDoListsThunks} from 'features/toDoLists/model/toDoLists/todolists-reducer'
import {tasksThunks} from 'features/toDoLists/model/tasks/tasks-reducer'
import {tasksSelector} from 'features/toDoLists/model/tasks/tasks-selector'
import {RequestStatusType} from 'app/model/app-reducer'
import {TasksStatuses} from 'utils/api/enums'
import {useActions} from 'utils/hooks/useActions'
import {FilterTasksButtons} from '../../../../components/filterTasksButtons/FilterTasksButtons'


type TodoListPropsType = {
    id: string;
    title: string;
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
    demo?: boolean;
};

export const ToDoList = memo(({demo = false, ...props}: TodoListPropsType) => {
    // Получили tasks из state используя хук - useSelector и selector - tasksSelector
    const tasks = useSelector(tasksSelector)

    // Используя useAction получили callbacks в которые уже входит dispatch
    const {updateTodoListsTC, deleteTodoListsTC} = useActions(toDoListsThunks)
    const {getTasksTC, addTaskTC} = useActions(tasksThunks)

    // -------------- Получили Tasks с сервера после загрузки страницы ----------------
    useEffect(() => {
        // Получаем tasks
        if (!demo) getTasksTC(props.id)
    }, [])

    // -------------- Меняем название todolist ----------------
    const changeToDoListTitle = useCallback((newTitle: string) => {
        updateTodoListsTC({toDoListID: props.id, title: newTitle})
    }, [props.id])

    // -------------- Добавление task ----------------
    const addTask = useCallback((title: string) => {
        addTaskTC({toDoListID: props.id, title})
    }, [props.id])


    // -------------- Удалить ToDoList ----------------
    const onClickDeleteListHandler = useCallback(() => {
        deleteTodoListsTC(props.id)
    }, [props.id])


    // -------------- Фильтрация Tasks ----------------
    const tasksForToDoList = tasks[props.id].filter(task => {
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
        <div className={S.to_Do_List}>
            <div className={S.to_Do_List__top}>
                <EditableSpan
                    value={props.title}
                    newClass={S.to_Do_List__header}
                    onChange={changeToDoListTitle}
                    disabled={props.entityStatus}
                />

                <IconButton aria-label="delete"
                            onClick={onClickDeleteListHandler}
                            disabled={props.entityStatus === 'loading'}>
                    <DeleteIcon/>
                </IconButton>
            </div>

            <AddItemForm addItem={addTask} itemType={'Task'} disabled={props.entityStatus}/>

            <div className={S.to_Do_List__lists}>
                {tasksForToDoList.map((el) => {
                    return (
                        <Task
                            key={el.id}
                            task={el}
                            toDoListID={props.id}
                            entityStatus={el.entityTaskStatus}
                        />
                    )
                })}
                {tasksForToDoList.length === 0 && (
                    <span className={S.no_tasks}>{noTasksText}</span>
                )}

            </div>
            <FilterTasksButtons filter={props.filter} toDoListID={props.id}/>
        </div>
    )
})
