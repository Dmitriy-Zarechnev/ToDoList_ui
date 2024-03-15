import {AppRootStateType, AppThunkDispatch} from './store'
import {todolistAPI, TodolistType} from '../api/todolist-api'

// Типизация Actions
export type ToDoListActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC>

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setToDoListsAC>

// Типизация Filters
export type FilterValuesType = 'all' | 'active' | 'completed'

// Типизация Todolists объединенный с filter
export type ToDoListDomainType = TodolistType & { filter: FilterValuesType }


// *********** Первоначальный стэйт для todolistsReducer ****************
const initialState: ToDoListDomainType[] = []

// *********** Reducer - редьюсер, чистая функция для изменения стэйта после получения экшена от диспача ****************
export const todolistsReducer = (state = initialState, action: ToDoListActionsType): ToDoListDomainType[] => {
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
                    order: 0
                },
                ...state
            ]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.toDoListID ? {...el, title: action.payload.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.toDoListID ? {...el, filter: action.payload.filter} : el)
        case 'SET-TODOLISTS':
            return action.payload.toDoLists.map(el => ({...el, filter: 'all'}))
        default :
            return state
    }
}

// *********** Action creators - экшн криэйторы создают объект action ****************
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

// *********** Thunk - санки необходимые для общения с DAL ****************

// ------------- Получение todolist с сервера -----------------------
export const getTodoListsTC = () => async (dispatch: AppThunkDispatch) => {
    // Запрос на получение todolist с сервера
    const getTodoListsData = await todolistAPI.getTodolists()

    // Задиспатчили ответ от сервера
    dispatch(setToDoListsAC(getTodoListsData))
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
            // Запрос на изменение todolist's title
            await todolistAPI.updateTodolist(todolistId, title)

            // Задиспатчили после ответа от сервера и поменяли title
            dispatch(changeTodolistTitleAC(todolistId, title))
        }
    }

// ------------- Добавление нового todolist -----------------------
export const addTodoListsTC = (title: string) => async (dispatch: AppThunkDispatch) => {
    // Запрос на добавление todolist
    const addTodoListsData = await todolistAPI.createTodolist(title)

    // Задиспатчили ответ от сервера
    dispatch(addTodolistAC(title, addTodoListsData.data.item.id))
}

// ------------- Удаление todolist -----------------------
export const deleteTodoListsTC = (toDoListID: string) => async (dispatch: AppThunkDispatch) => {
    // Запрос на удаление todolist
    await todolistAPI.deleteTodolist(toDoListID)

    // Задиспатчили после ответа от сервера и удалили todolist
    dispatch(removeTodolistAC(toDoListID))
}