import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import {tasksReducer} from '../../state/reducers/tasks-reducer'
import {todolistsReducer} from '../../state/reducers/todolists-reducer'
import {v1} from 'uuid'
import {AppRootStateType, RootReducerType} from '../../state/store'
import {TasksPriorities, TasksStatuses} from '../../api/tasks-api'
import {appReducer} from '../../state/reducers/app-reducer'
import {thunk} from 'redux-thunk'
import {authReducer} from '../../state/reducers/auth-reducer'
import {HashRouter} from 'react-router-dom'


const rootReducer:RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})


const initialGlobalState: AppRootStateType = {
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TasksStatuses.Completed,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId',
                entityTaskStatus: 'idle'
            },
            {
                id: v1(),
                title: 'JS',
                status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId',
                entityTaskStatus: 'idle'
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId',
                entityTaskStatus: 'idle'
            },
            {
                id: v1(),
                title: 'React Book',
                status: TasksStatuses.Completed,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId',
                entityTaskStatus: 'idle'
            }
        ]
    },
    todolists: [
        {
            id: 'todolistId1',
            title: 'What to learn',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: 'todolistId2', title: 'What to buy',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        }
    ],
    app: {
        status: 'idle',
        error: null,
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
}


export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as any, applyMiddleware(thunk))

// Декоратор, предоставляющий доступ к Redux-хранилищу в историях
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

// Декоратор, предоставляющий доступ к Redux-хранилищу в историях
export const HashRouterDecorator = (storyFn: () => React.ReactNode) => {
    return <HashRouter>{storyFn()}</HashRouter>
}