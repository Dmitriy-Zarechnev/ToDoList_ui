import {setAppErrorAC, setAppStatusAC} from '../state/reducers/app-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from 'api/todolist-api'

// generic function для серверной ошибки
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    // Проверили существование ошибки
    data.messages.length
        ? // Dispatch ошибку с сервера
        dispatch(setAppErrorAC({error: data.messages[0]}))
        : // Dispatch ошибку свою
        dispatch(setAppErrorAC({error: 'Some error occurred🤬'}))

    // Изменили статус
    dispatch(setAppStatusAC({status: 'failed'}))
}

