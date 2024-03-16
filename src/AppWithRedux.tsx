import React, {useCallback, useEffect} from 'react'
import './App.css'
import {ToDoList} from './components/toDoList/ToDoList'
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
import {addTodoListsTC, getTodoListsTC} from './state/todolists-reducer'
import {useSelector} from 'react-redux'
import {useAppDispatch} from './state/store'
import {toDoListsSelector} from './state/selectors/todolists-selector'


function AppWithRedux() {

    // Получили tasks из state используя хук - useSelector и selector - toDoListsSelector
    const toDoLists = useSelector(toDoListsSelector)

    // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
    const dispatch = useAppDispatch()

    // -------------- Получили ToDoLists с сервера после загрузки страницы ----------------
    useEffect(() => {
        dispatch(getTodoListsTC())
    }, [])


    // -------------- Добавить ToDoList ----------------
    const addToDoList = useCallback((title: string) => {
        dispatch(addTodoListsTC(title))
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
