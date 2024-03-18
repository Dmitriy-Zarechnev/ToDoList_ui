import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import {TasksActionsType, tasksReducer} from './tasks-reducer'
import {ToDoListActionsTypes, todolistsReducer} from './todolists-reducer'
import {thunk, ThunkDispatch} from 'redux-thunk'
import {useDispatch} from 'react-redux'


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

/* Второй параметр preloadedState необходимо указать undefined, чтоб не ругался store */

export const store = legacy_createStore(rootReducer, undefined, applyMiddleware(thunk))

// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof rootReducer>

// Типизация всех AC для типизации thunk
type CommonActionsTypeForApp =
    ToDoListActionsTypes |
    TasksActionsType

// Типизация для thunk, позволяет диспатчить thunk и action
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, CommonActionsTypeForApp>

// Самопальный useDispatch
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()


