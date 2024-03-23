// Типизация Actions всего authReducer
import {AppThunkDispatch} from '../store'
import {setAppInitializedAC, setAppStatusAC} from './app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {authAPI, LoginParamsType} from '../../api/auth-api'

export type AuthActionsTypes =
    ReturnType<typeof setIsLoggedInAC>


// Типизация initialState для authReducer
export type AuthInitialStateType = typeof initialState

// Константы для работы с action в authReducer
const SET_IS_LOGGED_IN = 'AUTH/SET-IS-LOGGED-IN'


// *********** Первоначальный state для authReducer ****************
const initialState = {
    isLoggedIn: false as boolean
}


// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const authReducer = (state: AuthInitialStateType = initialState, action: AuthActionsTypes): AuthInitialStateType => {
    switch (action.type) {
        case SET_IS_LOGGED_IN:
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// *********** Action creators - создают объект action ****************
export const setIsLoggedInAC = (value: boolean) => {
    return {type: SET_IS_LOGGED_IN, value} as const
}


// *********** Thunk - необходимы для общения с DAL ****************

// Логинизация на сервере
export const logInTC = (data: LoginParamsType) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    try {
        // Запрос на логинизацию
        const logInData = await authAPI.logIn(data)

        // Если успех
        if (logInData.resultCode === 0) {

            // Задиспатчили после ответа от сервера true
            dispatch(setIsLoggedInAC(true))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC('idle'))
        } else {
            // Обработка серверной ошибки
            handleServerAppError(logInData, dispatch)
        }
    } catch (error) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

// Проверка при первом входе
export const initializeMeTC = () => async (dispatch: AppThunkDispatch) => {

    try {
        // Запрос на проверку
        const meData = await authAPI.me()

        // Если успех
        if (meData.resultCode === 0) {

            // Задиспатчили после ответа от сервера true
            dispatch(setIsLoggedInAC(true))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC('idle'))
        } else {
            // Обработка серверной ошибки
            handleServerAppError(meData, dispatch)
        }
        // Инициализировали приложенеи после ответа
        dispatch(setAppInitializedAC(true))
    } catch (error) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }

}