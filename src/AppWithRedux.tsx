import React, {useReducer} from 'react'
import './App.css'
import {TasksType, ToDoList} from './components/toDoList/ToDoList'
import {v1} from 'uuid'
import {Input} from './components/input/Input'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC, todolistsReducer} from './state/todolists-reducer'
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './state/tasks-reducer'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from './state/store'


export type FilterValuesType = 'all' | 'active' | 'completed'

export type ToDoListType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TasksType[]
}


function AppWithRedux() {

    const toDoLists = useSelector<AppRootStateType, ToDoListType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    // -------------- Удаление task ----------------
    function removeTask(toDoListID: string, id: string) {
        dispatch(removeTaskAC(toDoListID, id))
    }

    // -------------- Добавление task ----------------
    function addTask(toDoListID: string, title: string) {
        dispatch(addTaskAC(toDoListID, title))
    }

    // -------------- Меняем checkbox ----------------
    function changeCheckBoxStatus(toDoListID: string, id: string, isDone: boolean) {
        dispatch(changeTaskStatusAC(toDoListID, id, isDone))
    }

    // -------------- Меняем taskTitle ----------------
    function changeTaskTitle(toDoListID: string, id: string, newTitle: string) {
        dispatch(changeTaskTitleAC(toDoListID, id, newTitle))
    }

    // ***********************************************************************************

    // -------------- Фильтрация task ----------------
    function changeFilter(todolistId: string, value: FilterValuesType) {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }

    // -------------- Меняем toDoListTitle ----------------
    function changeToDoListTitle(toDoListID: string, newTitle: string) {
        dispatch(changeTodolistTitleAC(toDoListID, newTitle))
    }

    // -------------- Удалить ToDoList ----------------
    function removeToDoList(id: string) {
        dispatch(removeTodolistAC(id))

    }

    // -------------- Добавить ToDoList ----------------
    function addToDoList(title: string) {
        const newToDoListId = v1()
        dispatch(addTodolistAC(title, newToDoListId))
    }

    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        TodoList
                    </Typography>
                    <Button color={'inherit'}>Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container>
                    <Input addItem={addToDoList} itemType={'Todolist'}/>
                </Grid>

                <Grid container spacing={3}>

                    {toDoLists.map(el => {
                        let allToDoListTasks = tasks[el.id]
                        let tasksForToDoList = allToDoListTasks

                        if (el.filter === 'active') {
                            tasksForToDoList = allToDoListTasks.filter((task) => !task.isDone)
                        }

                        if (el.filter === 'completed') {
                            tasksForToDoList = allToDoListTasks.filter((task) => task.isDone)
                        }

                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
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
                                />
                            </Paper>
                        </Grid>
                    })
                    }
                </Grid>
            </Container>

        </div>
    )
}

export default AppWithRedux
