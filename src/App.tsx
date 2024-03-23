import React from 'react'
import './App.css'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import {useSelector} from 'react-redux'
import LinearProgress from '@mui/material/LinearProgress'
import {appStatusSelector} from './state/selectors/app-selector'
import {ErrorSnackbar} from './components/errorSnackBar/ErrorSnackbar'
import {Route, Routes} from 'react-router-dom'
import {LogIn} from './components/logIn/LogIn'
import {ToDoLists} from './components/toDoLists/ToDoLists'

type AppPropsType = {
    demo?: boolean
}


function App({demo = false}: AppPropsType) {

    // Получили status из state используя хук - useSelector и selector - appStatusSelector
    const status = useSelector(appStatusSelector)


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
                {/*<ToDoLists demo={demo}/>*/}
                <Routes>
                    <Route path={'/'} element={<ToDoLists demo={demo}/>}/>
                    <Route path={'/login'} element={<LogIn/>}/>

                    <Route path={'/*'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>

        </div>
    )
}

export default App
