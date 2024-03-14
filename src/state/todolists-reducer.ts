import {FilterValuesType, ToDoListType} from '../AppWithRedux'
import {AppThunkDispatch} from './store'
import {todolistAPI, TodolistType} from '../api/todolist-api'


export type ToDoListActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC> |
    SetTodolistActionType

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setToDoListsAC>


// let toDoListID1 = v1()
// let toDoListID2 = v1()

// let [toDoLists, dispatchToDoLists] = useReducer(todolistsReducer,
//     [
//         {id: toDoListID1, title: 'What to learn', filter: 'all'},
//         {id: toDoListID2, title: 'What to read', filter: 'all'}
//     ]
// )
//

// *********** Первоначальный стэйт для todolistsReducer ****************
const initialState: ToDoListType[] = []

// *********** Reducer - редьюсер, чистая функция для изменения стэйта после получения экшена от диспача ****************
export const todolistsReducer = (state = initialState, action: ToDoListActionsType): ToDoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.payload.toDoListID)
        case 'ADD-TODOLIST':
            return [...state, {id: action.payload.todolistId, title: action.payload.title, filter: 'all'}]
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

export const getTodolistsTC = () => async (dispatch: AppThunkDispatch) => {
    const toDoListsData = await todolistAPI.getTodolists()
    dispatch(setToDoListsAC(toDoListsData))
}
