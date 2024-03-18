import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import {useSelector} from 'react-redux'
import {appErrorSelector, appStatusSelector} from '../state/selectors/app-selector'
import {useAppDispatch} from '../state/store'
import {setAppErrorAC, setAppStatusAC} from '../state/app-reducer'


export function ErrorSnackbar() {
    // Получили error из state используя хук - useSelector и selector - appErrorSelector
    const error = useSelector(appErrorSelector)

    // Получили status из state используя хук - useSelector и selector - appStatusSelector
    const status = useSelector(appStatusSelector)

    // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
    const dispatch = useAppDispatch()


    // Закрытие Snackbar при кликах
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // if (reason === 'clickaway') {
        //     return
        // }
        dispatch(setAppStatusAC('idle'))
        dispatch(setAppErrorAC(null))
    }

    return (
        <>
            <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    Error message 😠
                </Alert>
            </Snackbar>
            <Snackbar open={status === 'succeeded'} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                    Success update!😃
                </Alert>
            </Snackbar>
        </>
    )
}