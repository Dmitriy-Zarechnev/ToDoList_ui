import React, {memo, useCallback, useEffect} from 'react'
import S from './ToDoList.module.css'
import {AddItemForm} from '../../../../components/addItemForm/AddItemForm'
import {FilterValuesType} from 'features/toDoLists/model/toDoLists/todolists-reducer'
import {tasksThunks} from 'features/toDoLists/model/tasks/tasks-reducer'
import {RequestStatusType} from 'app/model/app-reducer'
import {useActions} from 'utils/hooks/useActions'
import {FilterTasksButtons} from '../../../../components/filterTasksButtons/FilterTasksButtons'
import {Tasks} from './tasks/Tasks'
import {ToDoListTitle} from './toDoListTitle/ToDoListTitle'


type TodoListPropsType = {
    id: string;
    title: string;
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
    demo?: boolean;
};

export const ToDoList = memo(({demo = false, ...props}: TodoListPropsType) => {

    // Используя useAction получили callbacks в которые уже входит dispatch
    //const {updateTodoListsTC, deleteTodoListsTC} = useActions(toDoListsThunks)
    const {getTasksTC, addTaskTC} = useActions(tasksThunks)

    // -------------- Получили Tasks с сервера после загрузки страницы ----------------
    useEffect(() => {
        // Получаем tasks
        if (!demo) getTasksTC(props.id)
    }, [])

/*
    // -------------- Меняем название todolist ----------------
    const changeToDoListTitle = useCallback((newTitle: string) => {
        updateTodoListsTC({toDoListID: props.id, title: newTitle})
    }, [props.id])

 */

    // -------------- Добавление task ----------------
    const addTask = useCallback((title: string) => {
        addTaskTC({toDoListID: props.id, title})
    }, [props.id])

/*
    // -------------- Удалить ToDoList ----------------
    const onClickDeleteListHandler = useCallback(() => {
        deleteTodoListsTC(props.id)
    }, [props.id])

 */


    return (
        <div className={S.to_Do_List}>
            {/*<div className={S.to_Do_List__top}>*/}
            {/*    <EditableSpan*/}
            {/*        value={props.title}*/}
            {/*        newClass={S.to_Do_List__header}*/}
            {/*        onChange={changeToDoListTitle}*/}
            {/*        disabled={props.entityStatus}*/}
            {/*    />*/}

            {/*    <IconButton aria-label="delete"*/}
            {/*                onClick={onClickDeleteListHandler}*/}
            {/*                disabled={props.entityStatus === 'loading'}>*/}
            {/*        <DeleteIcon/>*/}
            {/*    </IconButton>*/}
            {/*</div>*/}
            <ToDoListTitle title={props.title} entityStatus={props.entityStatus} toDoListID={props.id}/>
            <AddItemForm addItem={addTask} itemType={'Task'} disabled={props.entityStatus}/>
            <Tasks toDoListID={props.id} filter={props.filter}/>
            <FilterTasksButtons filter={props.filter} toDoListID={props.id}/>
        </div>
    )
})
