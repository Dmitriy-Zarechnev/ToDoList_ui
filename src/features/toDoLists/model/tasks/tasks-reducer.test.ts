import {addTaskTC, changeTaskEntityStatusAC, deleteTaskTC, getTasksTC, TasksInitialStateType, tasksReducer, updateTaskStatusTC, updateTaskTitleTC} from './tasks-reducer'
import {addTodoLists, deleteTodoLists, getTodoLists} from '../toDoLists/todolists-reducer'
import {TasksPriorities, TasksStatuses} from 'utils/api/enums'

let startState: TasksInitialStateType

beforeEach(() => {
    startState = {
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
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
                id: '2',
                title: 'JS',
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
                id: '3',
                title: 'React',
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
        todolistId2: [
            {
                id: '1',
                title: 'bread',
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
                id: '2',
                title: 'milk',
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
                id: '3',
                title: 'tea',
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
        ]
    }
})


test('correct task should be deleted from correct array', () => {
    const args = {toDoListID: 'todolistId2', taskId: '2'}
    const endState = tasksReducer(startState,
        deleteTaskTC.fulfilled(args, 'requestId', args))

    expect(endState).toEqual({
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
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
                id: '2',
                title: 'JS',
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
                id: '3',
                title: 'React',
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
        todolistId2: [
            {
                id: '1',
                title: 'bread',
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
                id: '3',
                title: 'tea',
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
        ]
    })
    expect(endState['todolistId2'].every((el) => el.id !== '2')).toBeTruthy()
})


test('correct task should be added to correct array', () => {
    const endState = tasksReducer(
        startState,
        addTaskTC.fulfilled({
            task: {
                id: '5',
                title: 'juce',
                status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'todolistId2',
                entityTaskStatus: 'idle'
            }
        }, 'requestId', {toDoListID: 'todolistId2', title: 'juce'})
    )

    expect(endState['todolistId1'].length).toBe(startState['todolistId1'].length)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TasksStatuses.New)
})


test('status of specified task should be changed', () => {
    const args = {
        toDoListID: 'todolistId2',
        taskId: '2',
        status: TasksStatuses.New
    }

    const endState = tasksReducer(startState,
        updateTaskStatusTC.fulfilled(args, 'requestId', args))

    expect(endState['todolistId2'][1].status).toBe(TasksStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TasksStatuses.Completed)
})


test('title of specified task should be changed', () => {
    const args = {toDoListID: 'todolistId1', taskId: '3', title: 'NodeJs'}

    const endState = tasksReducer(startState,
        updateTaskTitleTC.fulfilled(args, 'requestId', args))

    expect(endState['todolistId2'][2].title).toBe('tea')
    expect(endState['todolistId1'][2].title).toBe('NodeJs')
})


test('new array should be added when new todolist is added', () => {
    const endState = tasksReducer(startState,
        addTodoLists.fulfilled({title: 'new todolist', toDoListID: 'todolistId'},
            'requestId',
            'new todolist'))

    const keys = Object.keys(endState)
    const newKey = keys.find((k) => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})


test('property with todolistId should be deleted', () => {
    const endState = tasksReducer(startState,
        deleteTodoLists.fulfilled({toDoListID: 'todolistId2'}, 'requestId', 'todolistId2'))

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})


test('new array should be added when new todolist is set', () => {
    const startState = {
        todolistId1: [],
        todolistId2: []
    }

    const endState = tasksReducer(
        startState,
        getTodoLists.fulfilled({
            toDoLists: [
                {
                    id: '123',
                    title: 'What to learn',
                    addedDate: '',
                    order: 0
                },
                {
                    id: '321',
                    title: 'What to read',
                    addedDate: '',
                    order: 0
                }
            ]
        }, 'requestId')
    )

    const keys = Object.keys(endState)
    const newKey = keys.find((k) => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(4)
    expect(endState[newKey]).toEqual([])
})


test('tasks should be set from API ', () => {
    const endState = tasksReducer(
        startState,
        getTasksTC.fulfilled({
            toDoListID: 'todolistId1', tasks: [
                {
                    id: '1',
                    title: 'CSS',
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
                    id: '2',
                    title: 'JS',
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
        }, 'requestId', 'todolistId1')
    )

    expect(endState['todolistId1'].length).toBe(2)
})


test('tasks entity status should be changed', () => {

    const endState = tasksReducer(startState,
        changeTaskEntityStatusAC({toDoListID: 'todolistId1', taskId: '1', entityTaskStatus: 'loading'}))

    expect(endState['todolistId1'][0].entityTaskStatus).toBe('loading')
})
