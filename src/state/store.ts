import {combineReducers, legacy_createStore} from 'redux'
import {TasksActionsType, tasksReducer} from './tasks-reducer'
import {ToDoListActionsType, todolistsReducer} from './todolists-reducer'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer)

// @ts-ignore
window.store = store

// Типизация всех actioncreators для типизации thunk
type CommonActionsTypeForApp =
    ToDoListActionsType |
    TasksActionsType

// Типизация для thunk, позволяет диспатчить thunk
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, CommonActionsTypeForApp>
export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, CommonActionsTypeForApp>