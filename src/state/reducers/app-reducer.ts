// Типизация Actions всего appReducer
export type AppActionsTypes =
    ReturnType<typeof setAppStatusAC> |
    ReturnType<typeof setAppErrorAC> |
    ReturnType<typeof setAppInitializedAC>


// Типы статусов для работы в приложении
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' | 'updated'

// Типизация initialState для appReducer
export type InitialStateType = typeof initialState

// Константы для работы с action в appReducer
const SET_APP_STATUS = 'APP/SET-APP-STATUS'
const SET_APP_ERROR = 'APP/SET-APP-ERROR'
const SET_APP_INITIALIZED = 'APP/SET-APP-INITIALIZED'

// *********** Первоначальный state для appReducer ****************
const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean
}


// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const appReducer = (state: InitialStateType = initialState, action: AppActionsTypes): InitialStateType => {
    switch (action.type) {
        case SET_APP_STATUS:
            return {...state, status: action.status}

        case SET_APP_ERROR:
            return {...state, error: action.error}

        case SET_APP_INITIALIZED:
            return {...state, isInitialized: action.isInitialized}

        default:
            return state
    }
}

// *********** Action creators - создают объект action ****************
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: SET_APP_STATUS, status} as const
}
export const setAppErrorAC = (error: string | null) => {
    return {type: SET_APP_ERROR, error} as const
}
export const setAppInitializedAC = (isInitialized: boolean) => {
    return {type: SET_APP_INITIALIZED, isInitialized} as const
}

// *********** Thunk - необходимы для общения с DAL ****************



