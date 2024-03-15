import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import {tasksReducer} from '../../state/tasks-reducer'
import {todolistsReducer} from '../../state/todolists-reducer'
import {v1} from 'uuid'
import {AppRootStateType} from '../../state/store'
import {TasksPriorities, TasksStatuses} from '../../api/tasks-api'
import {thunk} from 'redux-thunk'


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
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
                todoListId: 'TodolistId'
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
                todoListId: 'TodolistId'
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
                todoListId: 'TodolistId'
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
                todoListId: 'TodolistId'
            }
        ]
    },
    todolists: [
        {
            id: 'todolistId1',
            title: 'What to learn',
            filter: 'all',
            addedDate: '',
            order: 0
        },
        {
            id: 'todolistId2', title: 'What to buy',
            filter: 'all',
            addedDate: '',
            order: 0
        }
    ]
}


// export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as any, applyMiddleware(thunk))

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as any, applyMiddleware(thunk))

// Декоратор, предоставляющий доступ к Redux-хранилищу в историях
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}