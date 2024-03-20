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
import LinearProgress from '@mui/material/LinearProgress'
import {appStatusSelector} from './state/selectors/app-selector'
import {ErrorSnackbar} from './components/errorSnackBar/ErrorSnackbar'

type AppPropsType = {
    demo?: boolean
}


function App({demo = false}: AppPropsType) {

    // Получили tasks из state используя хук - useSelector и selector - toDoListsSelector
    const toDoLists = useSelector(toDoListsSelector)

    // Получили status из state используя хук - useSelector и selector - appStatusSelector
    const status = useSelector(appStatusSelector)

    // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
    const dispatch = useAppDispatch()

    // -------------- Получили ToDoLists с сервера после загрузки страницы ----------------
    useEffect(() => {
        if (!demo) {
            dispatch(getTodoListsTC())
        }
    }, [])


    // -------------- Добавить ToDoList ----------------
    const addToDoList = useCallback((title: string) => {
        dispatch(addTodoListsTC(title))
    }, [])

    return (
        <div className="App">
            {/*ErrorSnackbar который показываем во время ошибки*/}
            <ErrorSnackbar/>

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

                {/*Preloader который показываем во время связи с сервером*/}
                {status === 'loading' && <LinearProgress/>}


            </AppBar>

            <Container fixed>
                <Grid container>
                    <AddItemForm addItem={addToDoList} itemType={'Todolist'}/>
                </Grid>

                <Grid container spacing={3}>

                    {toDoLists.map(el => {

                        return <Grid item key={el.id}>
                            <Paper style={{padding: '10px'}}>
                                <ToDoList
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    filter={el.filter}
                                    entityStatus={el.entityStatus}
                                    demo={demo}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>

        </div>
    )
}

export default App
