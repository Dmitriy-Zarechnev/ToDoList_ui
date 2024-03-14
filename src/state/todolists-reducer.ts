import {AppRootStateType, AppThunkDispatch} from './store'
import {todolistAPI, TodolistType} from '../api/todolist-api'

// Типизация Actions
export type ToDoListActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC> |
    SetTodolistActionType

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

export const getTodoListsTC = () => async (dispatch: AppThunkDispatch) => {
    const getTodoListsData = await todolistAPI.getTodolists()
    dispatch(setToDoListsAC(getTodoListsData))
}

export const updateTodoListsTC = (todolistId: string, title: string) =>
    async (dispatch: AppThunkDispatch, getState: () => AppRootStateType) => {

        const allTodoListsFromState = getState().todolists
        const todoList = allTodoListsFromState.find(t => {
            return t.id === todolistId
        })
        if (todoList) {
            await todolistAPI.updateTodolist(todolistId, title)
            dispatch(changeTodolistTitleAC(todolistId, title))
        }
    }

export const addTodoListsTC = (title: string) => async (dispatch: AppThunkDispatch) => {
    const addTodoListsData = await todolistAPI.createTodolist(title)
    dispatch(addTodolistAC(title, addTodoListsData.data.item.id))
}

export const deleteTodoListsTC = (toDoListID: string) => async (dispatch: AppThunkDispatch) => {
    await todolistAPI.deleteTodolist(toDoListID)
    dispatch(removeTodolistAC(toDoListID))
}