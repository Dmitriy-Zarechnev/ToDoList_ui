import React from 'react'
import {filterValuesType} from '../../App'
import {Button} from '../button/Button'
import S from './ToDoList.module.css'
import {Input} from '../input/Input'
import {EditableSpan} from '../editableSpan/EditableSpan'

export type TasksType = {
    id: string,
    title: string
    isDone: boolean
}

type TodoListPropsType = {
    id: string
    title: string
    filter: filterValuesType
    tasks: Array<TasksType>
    removeTask: (toDoListID: string, id: string) => void
    changeFilter: (todolistId: string, value: filterValuesType) => void
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
    const onClickBtnHandler = (todolistId: string, value: filterValuesType) => {
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

                <Button name={'⚔'} onClick={onClickDeleteListHandler}/>
            </div>

            <Input addItem={addTask} itemType={'Task'}/>

            <ul className={S.to_Do_List__lists}>
                {props.tasks.map((el) => {

                    return (
                        <li key={el.id} className={el.isDone ? `${S.to_Do_List__list} ${S.is_done}` : S.to_Do_List__list}>
                            <div className={S.to_Do_List__list_box}>
                                <input type="checkbox"
                                       checked={el.isDone}
                                       onChange={() => onChangeCheckBoxHandler(el.id, el.isDone)}
                                />

                                <EditableSpan value={el.title}
                                              onChange={(newTitle) => props.changeTaskTitle(props.id, el.id, newTitle)}
                                />
                            </div>

                            <Button name={'💥'} onClick={() => onClickRemoveHandler(el.id)}/>
                        </li>
                    )
                })}
            </ul>
            <div className={S.to_Do_List__btn_lists}>
                <Button
                    filter={props.filter}
                    name={'all'}
                    onClick={() => {
                        onClickBtnHandler(props.id, 'all')
                    }}/>
                <Button
                    filter={props.filter}
                    name={'active'}
                    onClick={() => {
                        onClickBtnHandler(props.id, 'active')
                    }}/>
                <Button
                    filter={props.filter}
                    name={'completed'}
                    onClick={() => {
                        onClickBtnHandler(props.id, 'completed')
                    }}/>
            </div>
        </div>
    )
}