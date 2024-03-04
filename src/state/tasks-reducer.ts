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

// let [tasks, dispatchTasks] = useReducer(tasksReducer, {
//     [toDoListID1]: [
//         {id: v1(), title: 'HTML&CSS', isDone: true},
//         {id: v1(), title: 'JS', isDone: true},
//         {id: v1(), title: 'ReactJS', isDone: false},
//         {id: v1(), title: 'Rest API', isDone: false},
//         {id: v1(), title: 'GraphL', isDone: false}
//     ],
//     [toDoListID2]: [
//         {id: v1(), title: 'Black Tower', isDone: true},
//         {id: v1(), title: 'Son of Sparta', isDone: false},
//         {id: v1(), title: 'Games of Thrones', isDone: true},
//         {id: v1(), title: 'Dune', isDone: true},
//         {id: v1(), title: 'Forbidden West', isDone: false}
//     ]
// })


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
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
            return state
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