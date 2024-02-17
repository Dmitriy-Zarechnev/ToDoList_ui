import {TasksStateType} from '../App'
import {v1} from 'uuid'
import {AddTodolistActionType, RemoveTodolistActionType} from './todolists-reducer'

type ActionsType =
    RemoveTaskActionType |
    AddTaskActionType |
    ChangeTaskStatusActionType |
    ChangeTaskTitleActionType |
    AddTodolistActionType |
    RemoveTodolistActionType

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>


export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID]
                    .filter(el => el.id !== action.payload.id)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.toDoListID]: [{id: v1(), title: action.payload.title, isDone: false},
                    ...state[action.payload.toDoListID]]
            }

        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID]
                    .map(el => el.id !== action.payload.id
                        ? el
                        : {...el, isDone: action.payload.isDone})
            }

        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID]
                    .map(el => el.id !== action.payload.id
                        ? el
                        : {...el, title: action.payload.title})
            }

        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.payload.todolistId]: []
            }

        case 'REMOVE-TODOLIST':
            const newState = {...state}
            delete newState[action.payload.toDoListID]
            return newState

        default :
            throw new Error('I don\'t understand this type 🤬')
    }
}


export const removeTaskAC = (toDoListID: string, id: string) => {
    return {type: 'REMOVE-TASK', payload: {toDoListID, id}} as const
}

export const addTaskAC = (toDoListID: string, title: string) => {
    return {type: 'ADD-TASK', payload: {toDoListID, title}} as const
}

export const changeTaskStatusAC = (toDoListID: string, id: string, isDone: boolean) => {
    return {type: 'CHANGE-TASK-STATUS', payload: {toDoListID, id, isDone}} as const
}

export const changeTaskTitleAC = (toDoListID: string, id: string, title: string) => {
    return {type: 'CHANGE-TASK-TITLE', payload: {toDoListID, id, title}} as const
}