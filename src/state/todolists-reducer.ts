import {FilterValuesType, ToDoListType} from '../App'
import {v1} from 'uuid'

type ActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType

type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>
type AddTodolistActionType = ReturnType<typeof AddTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodolistFilterAC>


export const todolistReducer = (state: ToDoListType[], action: ActionsType): ToDoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.payload.toDoListID)
        case 'ADD-TODOLIST':
            let newTodolistId = v1()
            return [...state, {id: newTodolistId, title: action.payload.title, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.toDoListID ? {...el, title: action.payload.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.toDoListID ? {...el, filter: action.payload.filter} : el)
        default :
            throw new Error('I don\'t understand this type 🤬')
    }
}


export const RemoveTodolistAC = (toDoListID: string) => {
    return {type: 'REMOVE-TODOLIST', payload: {toDoListID}} as const
}
export const AddTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', payload: {title}} as const
}
export const ChangeTodolistTitleAC = (toDoListID: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {toDoListID, title}} as const
}
export const ChangeTodolistFilterAC = (toDoListID: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {toDoListID, filter}} as const
}