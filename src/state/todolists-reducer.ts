import {AppRootStateType, AppThunkDispatch} from './store'
import {todolistAPI, TodolistType} from '../api/todolist-api'
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from './app-reducer'


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
const CHANGE_TODOLIST_ENTITY_STATUS = 'todolists/CHANGE-TODOLIST-ENTITY-STATUS'


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
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.payload.toDoListID)
        case 'ADD-TODOLIST':
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
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.toDoListID ? {...el, title: action.payload.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.toDoListID ? {...el, filter: action.payload.filter} : el)
        case 'SET-TODOLISTS':
            return action.payload.toDoLists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        case CHANGE_TODOLIST_ENTITY_STATUS:
            return state.map(el => el.id === action.payload.id ? {...el, entityStatus: action.payload.status} : el)
        default :
            return state
    }
}

// *********** Action creators - создают объект action ****************
export const removeTodolistAC = (toDoListID: string) => {
    return {type: 'REMOVE-TODOLIST', payload: {toDoListID}} as const
}
export const addTodolistAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TODOLIST', payload: {title, todolistId}} as const
}
export const changeTodolistTitleAC = (toDoListID: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {toDoListID, title}} as const
}
export const changeTodolistFilterAC = (toDoListID: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {toDoListID, filter}} as const
}
export const setToDoListsAC = (toDoLists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', payload: {toDoLists}} as const
}
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {type: CHANGE_TODOLIST_ENTITY_STATUS, payload: {id, status}} as const
}

// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------
export const getTodoListsTC = () => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    // Запрос на получение todolist с сервера
    const getTodoListsData = await todolistAPI.getTodolists()

    // Задиспатчили ответ от сервера
    dispatch(setToDoListsAC(getTodoListsData))

    // Убираем Preloader после успешного ответа
    dispatch(setAppStatusAC('succeeded'))
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

            // Запрос на изменение todolist's title
            const updateTodolistData = await todolistAPI.updateTodolist(todolistId, title)


            // Если успех
            if (updateTodolistData.resultCode === 0) {
                // Задиспатчили после ответа от сервера и поменяли title
                dispatch(changeTodolistTitleAC(todolistId, title))

                // Убираем Preloader после успешного ответа
                dispatch(setAppStatusAC('updated'))
            } else {
                // Проверили существование ошибки
                updateTodolistData.messages.length

                    // Задиспатчили ошибку с сервера
                    ? dispatch(setAppErrorAC(updateTodolistData.messages[0]))

                    // Задиспатчили ошибку свою
                    : dispatch(setAppErrorAC('Some error occurred🤬'))

                // Изменили статус
                dispatch(setAppStatusAC('failed'))
            }
        }
    }

// ------------- Добавление нового todolist -----------------------
export const addTodoListsTC = (title: string) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    // Запрос на добавление todolist
    const addTodoListsData = await todolistAPI.createTodolist(title)


    // Если успех
    if (addTodoListsData.resultCode === 0) {
        // Задиспатчили ответ от сервера
        dispatch(addTodolistAC(title, addTodoListsData.data.item.id))

        // Убираем Preloader после успешного ответа
        dispatch(setAppStatusAC('updated'))
    } else {
        // Проверили существование ошибки
        addTodoListsData.messages.length

            // Задиспатчили ошибку с сервера
            ? dispatch(setAppErrorAC(addTodoListsData.messages[0]))

            // Задиспатчили ошибку свою
            : dispatch(setAppErrorAC('Some error occurred🤬'))

        // Изменили статус
        dispatch(setAppStatusAC('failed'))
    }
}

// ------------- Удаление todolist -----------------------
export const deleteTodoListsTC = (toDoListID: string) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    // Запрос на удаление todolist
    await todolistAPI.deleteTodolist(toDoListID)

    // Задиспатчили после ответа от сервера и удалили todolist
    dispatch(removeTodolistAC(toDoListID))

    // Убираем Preloader после успешного ответа
    dispatch(setAppStatusAC('updated'))
}