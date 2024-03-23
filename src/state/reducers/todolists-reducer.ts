import {AppRootStateType, AppThunkDispatch} from '../store'
import {todolistAPI, TodolistType} from '../../api/todolist-api'
import {RequestStatusType, setAppStatusAC} from './app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {getTasksTC} from './tasks-reducer'


// Типизация Actions всего todolistsReducer
export type ToDoListActionsTypes =
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC> |
    ReturnType<typeof changeTodolistEntityStatusAC>


export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setToDoListsAC>

// Константы для работы с action в todolistsReducer
export const REMOVE_TODOLIST = 'TODOLISTS/REMOVE-TODOLIST'
export const ADD_TODOLIST = 'TODOLISTS/ADD-TODOLIST'
const CHANGE_TODOLIST_TITLE = 'TODOLISTS/CHANGE-TODOLIST-TITLE'
const CHANGE_TODOLIST_FILTER = 'TODOLISTS/CHANGE-TODOLIST-FILTER'
export const SET_TODOLISTS = 'TODOLISTS/SET-TODOLISTS'
const CHANGE_TODOLIST_ENTITY_STATUS = 'TODOLISTS/CHANGE-TODOLIST-ENTITY-STATUS'


// Типизация Filters
export type FilterValuesType = 'all' | 'active' | 'completed'

// Типизация Todolists объединенный с filter
export type ToDoListDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}


// *********** Первоначальный state для todolistsReducer ****************
const initialState: ToDoListDomainType[] = []

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const todolistsReducer = (state = initialState, action: ToDoListActionsTypes): ToDoListDomainType[] => {
    switch (action.type) {
        case REMOVE_TODOLIST:
            return state.filter(el => el.id !== action.payload.toDoListID)
        case ADD_TODOLIST:
            return [
                {
                    id: action.payload.todolistId,
                    title: action.payload.title,
                    filter: 'all',
                    addedDate: '',
                    order: 0,
                    entityStatus: 'idle'
                },
                ...state
            ]
        case CHANGE_TODOLIST_TITLE:
            return state.map(el => el.id === action.payload.toDoListID ? {...el, title: action.payload.title} : el)
        case CHANGE_TODOLIST_FILTER:
            return state.map(el => el.id === action.payload.toDoListID ? {...el, filter: action.payload.filter} : el)
        case SET_TODOLISTS:
            return action.payload.toDoLists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        case CHANGE_TODOLIST_ENTITY_STATUS:
            return state.map(el => el.id === action.payload.id ? {...el, entityStatus: action.payload.status} : el)
        default :
            return state
    }
}

// *********** Action creators - создают объект action ****************
export const removeTodolistAC = (toDoListID: string) => {
    return {type: REMOVE_TODOLIST, payload: {toDoListID}} as const
}
export const addTodolistAC = (title: string, todolistId: string) => {
    return {type: ADD_TODOLIST, payload: {title, todolistId}} as const
}
export const changeTodolistTitleAC = (toDoListID: string, title: string) => {
    return {type: CHANGE_TODOLIST_TITLE, payload: {toDoListID, title}} as const
}
export const changeTodolistFilterAC = (toDoListID: string, filter: FilterValuesType) => {
    return {type: CHANGE_TODOLIST_FILTER, payload: {toDoListID, filter}} as const
}
export const setToDoListsAC = (toDoLists: Array<TodolistType>) => {
    return {type: SET_TODOLISTS, payload: {toDoLists}} as const
}
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {type: CHANGE_TODOLIST_ENTITY_STATUS, payload: {id, status}} as const
}

// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------
export const getTodoListsTC = () => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    try {
        // Запрос на получение todolist с сервера
        const getTodoListsData = await todolistAPI.getTodolists()

        // Задиспатчили ответ от сервера
        dispatch(setToDoListsAC(getTodoListsData))

        // Задиспатчили tasks с сервера для каждого todolist
        getTodoListsData.forEach(el => {
            dispatch(getTasksTC(el.id))
        })


        // Убираем Preloader после успешного ответа
        dispatch(setAppStatusAC('succeeded'))
    } catch (error: any) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

// ------------- Изменение todolist's title -----------------------
export const updateTodoListsTC = (todolistId: string, title: string) =>
    async (dispatch: AppThunkDispatch, getState: () => AppRootStateType) => {

        // Получили все todolists из state
        const allTodoListsFromState = getState().todolists

        // Нашли нужный todolist по todolistId
        const todoList = allTodoListsFromState.find(t => {
            return t.id === todolistId
        })

        // Проверка, т.к find может вернуть undefined
        if (todoList) {
            // Показываем Preloader во время запроса
            dispatch(setAppStatusAC('loading'))

            try {
                // Запрос на изменение todolist's title
                const updateTodolistData = await todolistAPI.updateTodolist(todolistId, title)

                // Если успех
                if (updateTodolistData.resultCode === 0) {
                    // Задиспатчили после ответа от сервера и поменяли title
                    dispatch(changeTodolistTitleAC(todolistId, title))

                    // Убираем Preloader после успешного ответа
                    dispatch(setAppStatusAC('updated'))
                } else {
                    // Обработка серверной ошибки
                    handleServerAppError(updateTodolistData, dispatch)
                }
            } catch (error: any) {
                // Обработка сетевой ошибки
                handleServerNetworkError(error, dispatch)
            }
        }
    }

// ------------- Добавление нового todolist -----------------------
export const addTodoListsTC = (title: string) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    try {
        // Запрос на добавление todolist
        const addTodoListsData = await todolistAPI.createTodolist(title)


        // Если успех
        if (addTodoListsData.resultCode === 0) {
            // Задиспатчили ответ от сервера
            dispatch(addTodolistAC(title, addTodoListsData.data.item.id))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC('updated'))
        } else {
            // Обработка серверной ошибки
            handleServerAppError(addTodoListsData, dispatch)
        }
    } catch (error: any) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

// ------------- Удаление todolist -----------------------
export const deleteTodoListsTC = (toDoListID: string) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))
    // Отключаем кнопку во время запроса
    dispatch(changeTodolistEntityStatusAC(toDoListID, 'loading'))

    try {
        // Запрос на удаление todolist
        const deleteTodolistData = await todolistAPI.deleteTodolist(toDoListID)

        // Если успех
        if (deleteTodolistData.resultCode === 0) {
            // Задиспатчили после ответа от сервера и удалили todolist
            dispatch(removeTodolistAC(toDoListID))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC('updated'))
        } else {
            // Обработка серверной ошибки
            handleServerAppError(deleteTodolistData, dispatch)
        }
    } catch (error: any) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}