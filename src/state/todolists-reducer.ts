import {FilterValuesType, ToDoListType} from '../App'
import {v1} from 'uuid'

type ActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}

export const todolistReducer = (state: ToDoListType[], action: ActionsType): ToDoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            let newTodolistId = v1()
            return [...state, {id: newTodolistId, title: action.title, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        default :
            throw new Error('I don\'t understand this type 🤬')
    }
}


export const RemoveTodolistAC = (toDoListID: string): RemoveTodolistActionType => ({type: 'REMOVE-TODOLIST', id: toDoListID})
export const AddTodolistAC = (title: string): AddTodolistActionType => ({type: 'ADD-TODOLIST', title})
export const ChangeTodolistTitleAC = (toDoListID: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: toDoListID, title}
}
export const ChangeTodolistFilterAC = (toDoListID: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: toDoListID, filter}
}