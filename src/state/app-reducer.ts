// Типизация Actions всего appReducer
export type AppActionsTypes =
    ReturnType<typeof setAppStatusAC>


// Типы статусов для работы в приложении
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

// Типизация initialState для appReducer
type InitialStateType = typeof initialState

// Константы для работы с action в appReducer
const SET_STATUS = 'APP/SET-STATUS'

// *********** Первоначальный state для appReducer ****************
const initialState = {
    status: 'idle' as RequestStatusType
}


// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const appReducer = (state: InitialStateType = initialState, action: AppActionsTypes): InitialStateType => {
    switch (action.type) {
        case SET_STATUS:
            return {...state, status: action.status}
        default:
            return state
    }
}

// *********** Action creators - экшн криэйторы создают объект action ****************
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: SET_STATUS, status} as const
}

// *********** Thunk - санки необходимые для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------


