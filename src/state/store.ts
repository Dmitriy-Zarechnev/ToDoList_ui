import {combineReducers, legacy_createStore} from 'redux'
import {TasksActionsType, tasksReducer} from './tasks-reducer'
import {ToDoListActionsType, todolistsReducer} from './todolists-reducer'
import {ThunkDispatch} from 'redux-thunk'
import {useDispatch} from 'react-redux'


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

// Типизация для thunk, позволяет диспатчить thunk и action
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, CommonActionsTypeForApp>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()


