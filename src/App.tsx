import React, {useState} from 'react'
import './App.css'
import {TasksType, ToDoList} from './components/toDoList/ToDoList'
import {v1} from 'uuid'
import {Input} from './components/input/Input'

export type filterValuesType = 'all' | 'active' | 'completed'

type ToDoListType = {
    id: string,
    title: string,
    filter: filterValuesType
}

type TasksStateType = {
    [key: string]: TasksType[]
}


function App() {

    // -------------- Initial state ----------------
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    let [toDoLists, setToDoLists] = useState<ToDoListType[]>(
        [
            {id: toDoListID1, title: 'What to learn', filter: 'all'},
            {id: toDoListID2, title: 'What to read', filter: 'all'}
        ]
    )

    let [tasks, setTasks] = useState<TasksStateType>({
        [toDoListID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphL', isDone: false}
        ],
        [toDoListID2]: [
            {id: v1(), title: 'Black Tower', isDone: true},
            {id: v1(), title: 'Son of Sparta', isDone: false},
            {id: v1(), title: 'Games of Thrones', isDone: true},
            {id: v1(), title: 'Dune', isDone: true},
            {id: v1(), title: 'Forbidden West', isDone: false}
        ]
    })

    // -------------- Удаление task ----------------
    function removeTask(toDoListID: string, id: string) {
        setTasks({...tasks, [toDoListID]: tasks[toDoListID].filter(el => el.id !== id)})
    }

    // -------------- Фильтрация task ----------------
    function changeFilter(todolistId: string, value: filterValuesType) {
        setToDoLists(toDoLists.map(el => el.id === todolistId ? {...el, filter: value} : el))
    }

    // -------------- Добавление task ----------------
    function addTask(toDoListID: string, title: string) {
        setTasks({...tasks, [toDoListID]: [{id: v1(), title, isDone: false}, ...tasks[toDoListID]]})
    }

    // -------------- Меняем checkbox ----------------
    function changeCheckBoxStatus(toDoListID: string, id: string, isDone: boolean) {
        setTasks({...tasks, [toDoListID]: tasks[toDoListID].map(el => el.id === id ? {...el, isDone} : el)})
    }

    // -------------- Меняем taskTitle ----------------
    function changeTaskTitle(toDoListID: string, id: string, newTitle: string) {
        setTasks({...tasks, [toDoListID]: tasks[toDoListID].map(el => el.id === id ? {...el, title: newTitle} : el)})
    }

    // -------------- Меняем toDoListTitle ----------------
    function changeToDoListTitle(toDoListID: string, newTitle: string) {
        setToDoLists(toDoLists.map(el => el.id === toDoListID ? {...el, title: newTitle} : el))
    }

    // -------------- Удалить ToDoList ----------------
    function removeToDoList(id: string) {
        setToDoLists(toDoLists.filter(el => el.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    }

    // -------------- Добавить ToDoList ----------------
    function addToDoList(title: string) {
        let newToDoListId = v1()
        setToDoLists([{id: newToDoListId, title, filter: 'all'}, ...toDoLists])
        setTasks({...tasks, [newToDoListId]: []})
    }

    return (
        <div className="App">
            <Input addItem={addToDoList} itemType={'Todolist'}/>
            <div className={'to_do_lists'}>
                {toDoLists.map(el => {
                    let allToDoListTasks = tasks[el.id]
                    let tasksForToDoList = allToDoListTasks

                    if (el.filter === 'active') {
                        tasksForToDoList = allToDoListTasks.filter((task) => !task.isDone)
                    }

                    if (el.filter === 'completed') {
                        tasksForToDoList = allToDoListTasks.filter((task) => task.isDone)
                    }

                    return (
                        <ToDoList
                            key={el.id}
                            id={el.id}
                            title={el.title}
                            tasks={tasksForToDoList}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTask={addTask}
                            changeCheckBoxStatus={changeCheckBoxStatus}
                            filter={el.filter}
                            removeToDoList={removeToDoList}
                            changeTaskTitle={changeTaskTitle}
                            changeToDoListTitle={changeToDoListTitle}
                        />)
                })}
            </div>
        </div>
    )
}

export default App