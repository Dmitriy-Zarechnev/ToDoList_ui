import {TasksInitialStateType, tasksReducer} from './tasks/tasks-reducer'
import {addTodoLists, ToDoListDomainType, toDoListsActions, toDoListsReducer} from './toDoLists/todolists-reducer'
import {v1} from 'uuid'
import {TasksPriorities, TasksStatuses} from 'utils/api/enums'


test('ids should be equals', () => {
    const startTasksState: TasksInitialStateType = {}
    const startTodoListsState: Array<ToDoListDomainType> = []

    const action = addTodoLists.fulfilled(
        {title: 'new todolist', toDoListID: 'todolistId3'},
        'requestId',
        'new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = toDoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodoLists = endTodoListsState[0].id

    expect(idFromTasks).toBe(action.payload.toDoListID)
    expect(idFromTodoLists).toBe(action.payload.toDoListID)
})


test('tasks and toDoLists should be empty', () => {
    const startTasksState: TasksInitialStateType = {
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
    }
    const startToDoListsState: Array<ToDoListDomainType> = [
        {
            id: 'todolistId1',
            title: 'What to learn',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        },
        {
            id: 'todolistId2',
            title: 'What to buy',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: 'idle'
        }
    ]

    const endTasksState = tasksReducer(startTasksState, toDoListsActions.clearToDoData())
    const endToDoListsState = toDoListsReducer(startToDoListsState, toDoListsActions.clearToDoData())

    expect(endTasksState).toEqual({})
    expect(endToDoListsState).toEqual([])
})
