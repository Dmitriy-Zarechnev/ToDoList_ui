import React, {useCallback} from 'react'
import './App.css'
import {TasksType, ToDoList} from './components/toDoList/ToDoList'
import {v1} from 'uuid'
import {AddItemForm} from './components/addItemForm/AddItemForm'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from './state/todolists-reducer'
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer'
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
    const removeTask = useCallback((toDoListID: string, id: string) => {
        dispatch(removeTaskAC(toDoListID, id))
    }, [])

    // -------------- Добавление task ----------------
    const addTask = useCallback((toDoListID: string, title: string) => {
        dispatch(addTaskAC(toDoListID, title))
    }, [])

    // -------------- Меняем checkbox ----------------
    const changeCheckBoxStatus = useCallback((toDoListID: string, id: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(toDoListID, id, isDone))
    }, [])

    // -------------- Меняем taskTitle ----------------
    const changeTaskTitle = useCallback((toDoListID: string, id: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(toDoListID, id, newTitle))
    }, [])

    // ***********************************************************************************

    // -------------- Фильтрация task ----------------
    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [])

    // -------------- Меняем toDoListTitle ----------------
    const changeToDoListTitle = useCallback((toDoListID: string, newTitle: string) => {
        dispatch(changeTodolistTitleAC(toDoListID, newTitle))
    }, [])

    // -------------- Удалить ToDoList ----------------
    const removeToDoList = useCallback((id: string) => {
        dispatch(removeTodolistAC(id))
    }, [])

    // -------------- Добавить ToDoList ----------------
    const addToDoList = useCallback((title: string) => {
        const newToDoListId = v1()
        dispatch(addTodolistAC(title, newToDoListId))
    }, [])

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
                    <AddItemForm addItem={addToDoList} itemType={'Todolist'}/>
                </Grid>

                <Grid container spacing={3}>

                    {toDoLists.map(el => {

                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <ToDoList
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    tasks={tasks[el.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeCheckBoxStatus={changeCheckBoxStatus}
                                    filter={el.filter}
                                    removeToDoList={removeToDoList}
                                    changeTaskTitle={changeTaskTitle}
                                    changeToDoListTitle={changeToDoListTitle}/>
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>

        </div>
    )
}

export default AppWithRedux
