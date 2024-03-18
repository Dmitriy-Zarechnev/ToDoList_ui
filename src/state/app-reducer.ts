// Типизация Actions всего appReducer
export type AppActionsTypes =
    ReturnType<typeof setAppStatusAC> |
    ReturnType<typeof setAppErrorAC>


// Типы статусов для работы в приложении
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' | 'updated'

// Типизация initialState для appReducer
type InitialStateType = typeof initialState

// Константы для работы с action в appReducer
const SET_STATUS = 'APP/SET-STATUS'
const SET_ERROR = 'APP/SET-ERROR'

// *********** Первоначальный state для appReducer ****************
const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null
}


// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const appReducer = (state: InitialStateType = initialState, action: AppActionsTypes): InitialStateType => {
    switch (action.type) {
        case SET_STATUS:
            return {...state, status: action.status}

        case SET_ERROR:
            return {...state, error: action.error}
        default:
            return state
    }
}

// *********** Action creators - создают объект action ****************
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: SET_STATUS, status} as const
}
export const setAppErrorAC = (error: string | null) => {
    return {type: SET_ERROR, error} as const
}

// *********** Thunk - необходимы для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------


