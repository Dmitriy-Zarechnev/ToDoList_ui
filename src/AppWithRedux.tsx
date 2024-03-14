import React, {useCallback, useEffect} from 'react'
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
import {addTodolistAC, getTodolistsTC} from './state/todolists-reducer'
import {useSelector} from 'react-redux'
import {AppRootStateType, useAppDispatch} from './state/store'
import {ItemsType} from './api/tasks-api'


export type FilterValuesType = 'all' | 'active' | 'completed'

export type ToDoListType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<ItemsType>
}


function AppWithRedux() {

    const toDoLists = useSelector<AppRootStateType, ToDoListType[]>(state => state.todolists)
    const dispatch = useAppDispatch()

    // -------------- Получили ToDoList с сервера ----------------
    useEffect(() => {
        dispatch(getTodolistsTC)
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
                                    filter={el.filter}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>

        </div>
    )
}

export default AppWithRedux
