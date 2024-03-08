import React, {useCallback} from 'react'
import {FilterValuesType} from '../../App'
import S from './ToDoList.module.css'
import {AddItemForm} from '../addItemForm/AddItemForm'
import {EditableSpan} from '../editableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import {Task} from '../task/Task'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from '../../state/store'
import {TasksStateType} from '../../AppWithRedux'
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from '../../state/todolists-reducer'
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../../state/tasks-reducer'


export type TasksType = {
    id: string,
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    id: string
    title: string
    filter: FilterValuesType
}

export const ToDoList = React.memo((props: TodoListPropsType) => {

    const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks)
    const dispatch = useDispatch()

    // -------------- Меняем название todolist ----------------
    const changeToDoListTitle = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitleAC(props.id, newTitle))
    }, [props.id])

    // const changeToDoListTitle = useCallback((newTitle: string) => {
    //     props.changeToDoListTitle(props.id, newTitle)
    // }, [props.changeToDoListTitle, props.id])

    // -------------- Добавление task ----------------

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(props.id, title))
    }, [props.id])

    /*
    const addTask = useCallback((title: string) => {
        props.addTask(props.id, title)
    }, [props.addTask, props.id])
     */

    // -------------- Фильтрация task ----------------

    const onClickBtnHandler = useCallback((value: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(props.id, value))
    }, [props.id])

    /*
        const onClickBtnHandler = useCallback((value: FilterValuesType) => {
            props.changeFilter(props.id, value)
        }, [props.changeFilter, props.id])
         */
    // -------------- Удаление task ----------------
    const onClickRemoveHandler = useCallback((id: string) => {
        dispatch(removeTaskAC(props.id, id))
    }, [props.id])

    /*
    const onClickRemoveHandler = useCallback((id: string) => {
        props.removeTask(props.id, id)
    }, [props.removeTask, props.id])
    */

    // -------------- Меняем checkbox ----------------
    const onChangeCheckBoxHandler = useCallback((taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(props.id, taskId, !isDone))
    }, [props.id])

    /*
    const onChangeCheckBoxHandler = useCallback((taskId: string, isDone: boolean) => {
        props.changeCheckBoxStatus(props.id, taskId, !isDone)
    }, [props.changeCheckBoxStatus, props.id])
    */

    // -------------- Удалить ToDoList ----------------
    const onClickDeleteListHandler = useCallback(() => {
        dispatch(removeTodolistAC(props.id))
    }, [props.id])

    /*
     const onClickDeleteListHandler = useCallback(() => {
        props.removeToDoList(props.id)
    }, [props.removeToDoList, props.id])
    */


    // -------------- Меняем Task's title ----------------
    const changeTaskTitle = useCallback((id: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(props.id, id, newTitle))
    }, [props.id])

    /*
     const onClickDeleteListHandler = useCallback(() => {
        props.removeToDoList(props.id)
    }, [props.removeToDoList, props.id])
    */
    // -------------- Фильтрация Tasks ----------------
    let tasksForToDoList = tasks[props.id]

    if (props.filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter((task) => !task.isDone)
    }

    if (props.filter === 'completed') {
        tasksForToDoList = tasksForToDoList.filter((task) => task.isDone)
    }


    return (
        <div className={S.to_Do_List}>
            <div className={S.to_Do_List__top}>
                <EditableSpan value={props.title}
                              newClass={S.to_Do_List__header}
                              onChange={changeToDoListTitle}/>

                <IconButton aria-label="delete" onClick={onClickDeleteListHandler}>
                    <DeleteIcon/>
                </IconButton>
            </div>

            <AddItemForm addItem={addTask} itemType={'Task'}/>

            <div className={S.to_Do_List__lists}>
                {tasksForToDoList.map((el) => {
                    return <Task key={el.id}
                                 task={el}
                                 changeTaskTitle={(newTitle) => changeTaskTitle(el.id, newTitle)}
                                 onChangeCheckBoxHandler={onChangeCheckBoxHandler}
                                 onClickRemoveHandler={onClickRemoveHandler}/>

                })}
            </div>
            <div className={S.to_Do_List__btn_lists}>
                <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                        onClick={() => {
                            onClickBtnHandler('all')
                        }}
                        color={'secondary'}
                > All
                </Button>

                <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                        onClick={useCallback(() => {
                            onClickBtnHandler('active')
                        }, [])}
                > Active
                </Button>

                <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                        onClick={useCallback(() => {
                            onClickBtnHandler('completed')
                        }, [])}
                        color={'success'}
                > Completed
                </Button>
            </div>
        </div>
    )
})