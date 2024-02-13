import {ToDoListType} from '../App'
import {v1} from 'uuid'

type ActionType = {
    type: string
    [key: string]: any
}

export const todolistReducer = (state: ToDoListType[], action: ActionType): ToDoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            let newTodolistId = v1()
            return [...state, {id: newTodolistId, title: action.title, filter: 'all'}]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        default :
            throw new Error('I don\'t understand this type 🤬')
    }
}