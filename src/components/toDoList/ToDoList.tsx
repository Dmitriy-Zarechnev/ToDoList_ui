import React from 'react'
import {FilterValuesType} from '../../App'
import S from './ToDoList.module.css'
import {Input} from '../input/Input'
import {EditableSpan} from '../editableSpan/EditableSpan'
import {Button, Checkbox, IconButton} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

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

export const ToDoList: React.FC<TodoListPropsType> = (props) => {

    // -------------- Меняем название todolist ----------------
    const changeToDoListTitle = (newTitle: string) => {
        props.changeToDoListTitle(props.id, newTitle)
    }

    // -------------- Добавление task ----------------
    const addTask = (title: string) => {
        props.addTask(props.id, title)
    }

    // -------------- Фильтрация task ----------------
    const onClickBtnHandler = (todolistId: string, value: FilterValuesType) => {
        props.changeFilter(todolistId, value)
    }

    // -------------- Удаление task ----------------
    const onClickRemoveHandler = (id: string) => {
        props.removeTask(props.id, id)
    }

    // -------------- Меняем checkbox ----------------
    const onChangeCheckBoxHandler = (taskId: string, isDone: boolean) => {
        props.changeCheckBoxStatus(props.id, taskId, !isDone)
    }

    // -------------- Удалить ToDoList ----------------
    const onClickDeleteListHandler = () => {
        props.removeToDoList(props.id)
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

            <Input addItem={addTask} itemType={'Task'}/>

            <div className={S.to_Do_List__lists}>
                {props.tasks.map((el) => {

                    return (
                        <div key={el.id} className={el.isDone ? `${S.to_Do_List__list} ${S.is_done}` : S.to_Do_List__list}>
                            <div className={S.to_Do_List__list_box}>

                                <Checkbox
                                    color={'success'}
                                    checked={el.isDone}
                                    onChange={() => onChangeCheckBoxHandler(el.id, el.isDone)}
                                />

                                <EditableSpan value={el.title}
                                              onChange={(newTitle) => props.changeTaskTitle(props.id, el.id, newTitle)}
                                />
                            </div>

                            <IconButton aria-label="delete" size="small" onClick={() => onClickRemoveHandler(el.id)}>
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    )
                })}
            </div>
            <div className={S.to_Do_List__btn_lists}>

                <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                        onClick={() => {
                            onClickBtnHandler(props.id, 'all')
                        }}
                        color={'secondary'}
                >
                    All
                </Button>

                <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                        onClick={() => {
                            onClickBtnHandler(props.id, 'active')
                        }}
                        color={'inherit'}
                >
                    Active
                </Button>

                <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                        onClick={() => {
                            onClickBtnHandler(props.id, 'completed')
                        }}
                        color={'success'}
                >
                    Completed
                </Button>

            </div>
        </div>
    )
}