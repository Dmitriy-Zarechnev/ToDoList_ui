import React, {memo, useCallback, useEffect} from 'react'
import S from './ToDoList.module.css'
import {AddItemForm} from "common/components/addItemForm/AddItemForm"
import {FilterValuesType} from 'features/toDoLists/model/toDoLists/todolists-reducer'
import {tasksThunks} from 'features/toDoLists/model/tasks/tasks-reducer'
import { RequestStatusType} from 'app/model/app-reducer'
import {useActions} from 'common/hooks/useActions'
import {FilterTasksButtons} from './filterTasksButtons/FilterTasksButtons'
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
    const {getTasks, addTask} = useActions(tasksThunks)


    // -------------- Получили Tasks с сервера после загрузки страницы ----------------
    useEffect(() => {
        // Получаем tasks
        if (!demo) getTasks(props.id)
    }, [])


    // -------------- Добавление task ----------------
    const addTaskHandler = useCallback((title: string) => {
        return addTask({toDoListID: props.id, title}).unwrap()
    }, [props.id])


    return (
        <div className={S.to_Do_List}>
            <ToDoListTitle title={props.title} entityStatus={props.entityStatus} toDoListID={props.id}/>
            <AddItemForm addItem={addTaskHandler} itemType={'Task'} disabled={props.entityStatus}/>
            <Tasks toDoListID={props.id} filter={props.filter}/>
            <FilterTasksButtons filter={props.filter} toDoListID={props.id}/>
        </div>
    )
})
