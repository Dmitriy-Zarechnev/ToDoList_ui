import React, {useCallback} from 'react'
import {FilterValuesType} from '../../App'
import S from './ToDoList.module.css'
import {AddItemForm} from '../input/AddItemForm'
import {EditableSpan} from '../editableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'


export type TasksType = {
    id: string,
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TasksType>
    removeTask: (toDoListID: string, id: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (toDoListID: string, title: string) => void
    changeCheckBoxStatus: (toDoListID: string, id: string, isDone: boolean) => void
    removeToDoList: (id: string) => void
    changeTaskTitle: (toDoListID: string, id: string, newTitle: string) => void
    changeToDoListTitle: (toDoListID: string, newTitle: string) => void
}

export const ToDoList = React.memo((props: TodoListPropsType) => {

    // -------------- Меняем название todolist ----------------
    const changeToDoListTitle = useCallback((newTitle: string) => {
        props.changeToDoListTitle(props.id, newTitle)
    }, [props.changeToDoListTitle, props.id])

    // -------------- Добавление task ----------------
    const addTask = useCallback((title: string) => {
        props.addTask(props.id, title)
    }, [props.addTask, props.id])

    // -------------- Фильтрация task ----------------
    const onClickBtnHandler = useCallback((value: FilterValuesType) => {
        props.changeFilter(props.id, value)
    }, [props.changeFilter, props.id])

    // -------------- Удаление task ----------------
    const onClickRemoveHandler = useCallback((id: string) => {
        props.removeTask(props.id, id)
    }, [props.removeTask, props.id])

    // -------------- Меняем checkbox ----------------
    const onChangeCheckBoxHandler = useCallback((taskId: string, isDone: boolean) => {
        props.changeCheckBoxStatus(props.id, taskId, !isDone)
    }, [props.changeCheckBoxStatus, props.id])

    // -------------- Удалить ToDoList ----------------
    const onClickDeleteListHandler = useCallback(() => {
        props.removeToDoList(props.id)
    }, [props.removeToDoList, props.id])

    // -------------- Фильтрация Tasks ----------------
    let tasksForToDoList = props.tasks

    if (props.filter === 'active') {
        tasksForToDoList = props.tasks.filter((task) => !task.isDone)
    }

    if (props.filter === 'completed') {
        tasksForToDoList = props.tasks.filter((task) => task.isDone)
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

                    return (
                        <div key={el.id}
                             className={el.isDone ? `${S.to_Do_List__list} ${S.is_done}` : S.to_Do_List__list}>
                            <div className={S.to_Do_List__list_box}>

                                <Checkbox
                                    color={'success'}
                                    checked={el.isDone}
                                    onChange={() =>
                                        onChangeCheckBoxHandler(el.id, el.isDone)}
                                />

                                <EditableSpan value={el.title}
                                              onChange={(newTitle) =>
                                                  props.changeTaskTitle(props.id, el.id, newTitle)}
                                />
                            </div>

                            <IconButton aria-label="delete" size="small"
                                        onClick={() =>
                                            onClickRemoveHandler(el.id)}>
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    )
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