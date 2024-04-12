import React, {useEffect} from 'react'
import S from './App.module.css'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import {useSelector} from 'react-redux'
import LinearProgress from '@mui/material/LinearProgress'
import {appIsInitializedSelector, appStatusSelector} from 'app/model/app-selector'
import {ErrorSnackbar} from 'components/errorSnackBar/ErrorSnackbar'
import {Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {LogIn} from 'features/auth/ui/LogIn'
import {ToDoLists} from 'features/toDoLists/ToDoLists'
import {authThunks} from 'features/auth/model/auth-reducer'
import CircularProgress from '@mui/material/CircularProgress'
import {isLoggedInSelector} from 'features/auth/model/auth-selector'
import {useActions} from 'utils/hooks/useActions'
import {ErrorPage} from "components/errorPage/ErrorPage"


type AppPropsType = {
    demo?: boolean;
};

function App({demo = false}: AppPropsType) {
    // Получили status из state используя хук - useSelector и selector - appStatusSelector
    const status = useSelector(appStatusSelector)
    // Получили isInitialized из state используя хук - useSelector и selector - appIsInitializedSelector
    const isInitialized = useSelector(appIsInitializedSelector)
    // Получили isLoggedIn из state используя хук - useSelector и selector - isLoggedInSelector
    const isLoggedIn = useSelector(isLoggedInSelector)

    // useActions - это кастомный хук, который уже протипизирован и лежит в useActions
    const {initializeMe, logOut} = useActions(authThunks)

    useEffect(() => {
        if (!demo) initializeMe()
    }, [])

    // Крутилка во время инициализации
    if (!isInitialized) {
        return (
            <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
                <CircularProgress/>
            </div>
        )
    }

    // Функция для logOut
    const onClickHandler = () => {
        isLoggedIn ? logOut() : <Navigate to={'/login'}/>
    }

    return (
        <div className="App">
            {/*ErrorSnackbar который показываем во время ошибки*/}
            <ErrorSnackbar/>

            {/*Header для приложения*/}
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        <NavLink to={'/'} className={S.link_to_app}>ToDoList ☢</NavLink>
                    </Typography>
                    <Button color={'warning'}
                            onClick={onClickHandler}
                            size="medium"
                            variant={'contained'}>
                        {isLoggedIn ? 'Log Out 📛'
                            : <NavLink to={'/login'} className={S.link_to_login}>Log In</NavLink>}
                    </Button>
                </Toolbar>

                {/*Preloader который показываем во время связи с сервером*/}
                {status === 'loading' && <LinearProgress/>}
            </AppBar>

            {/*Routes для приложения*/}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<ToDoLists demo={demo}/>}/>
                    <Route path={'/login'} element={<LogIn/>}/>

                    <Route path={'/*'} element={<ErrorPage/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
