import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import {TasksActionsType, tasksReducer} from './reducers/tasks-reducer'
import {ToDoListActionsTypes, todolistsReducer} from './reducers/todolists-reducer'
import {thunk, ThunkDispatch} from 'redux-thunk'
import {useDispatch} from 'react-redux'
import {AppActionsTypes, appReducer} from './reducers/app-reducer'


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

/* Второй параметр preloadedState необходимо указать undefined, чтоб не ругался store */
export const store = legacy_createStore(rootReducer, undefined, applyMiddleware(thunk))

// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof rootReducer>

// Типизация всех AC для типизации thunk
type CommonActionsTypes =
    ToDoListActionsTypes |
    TasksActionsType |
    AppActionsTypes

// Типизация для thunk, позволяет диспатчить thunk и action
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, CommonActionsTypes>

// Самопальный useDispatch
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()


