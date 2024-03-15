import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, setTasksAC, tasksReducer, TasksStateType} from '../tasks-reducer'
import {addTodolistAC, removeTodolistAC, setToDoListsAC, ToDoListDomainType, todolistsReducer} from '../todolists-reducer'
import {TasksPriorities, TasksStatuses} from '../../api/tasks-api'

let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS',
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
                id: '2', title: 'JS', status: TasksStatuses.Completed,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId'
            },
            {
                id: '3', title: 'React', status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread',
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
                id: '2', title: 'milk',
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
                id: '3', title: 'tea',
                status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId'
            }
        ]
    }
})


test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2', '2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS',
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
                id: '2', title: 'JS', status: TasksStatuses.Completed,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId'
            },
            {
                id: '3', title: 'React', status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId'
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread',
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
                id: '3', title: 'tea',
                status: TasksStatuses.New,
                priority: TasksPriorities.Low,
                deadline: '',
                order: 0,
                startDate: '',
                description: 'Hello',
                addedDate: '',
                todoListId: 'TodolistId'
            }
        ]
    })
    expect(endState['todolistId2'].every(el => el.id !== '2')).toBeTruthy()
})


test('correct task should be added to correct array', () => {

    const action = addTaskAC({
        id: '5',
        title: 'juce',
        status: TasksStatuses.New,
        priority: TasksPriorities.Low,
        deadline: '',
        order: 0,
        startDate: '',
        description: 'Hello',
        addedDate: '',
        todoListId: 'todolistId2'
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(startState['todolistId1'].length)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TasksStatuses.New)
})


test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC('todolistId2', '2', TasksStatuses.New)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TasksStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TasksStatuses.Completed)
})


test('title of specified task should be changed', () => {


    const action = changeTaskTitleAC('todolistId1', '3', 'NodeJs')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][2].title).toBe('tea')
    expect(endState['todolistId1'][2].title).toBe('NodeJs')
})


test('new array should be added when new todolist is added', () => {


    const action = addTodolistAC('new todolist', 'todolistId')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})


test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})


test('new array should be added when new todolist is set', () => {
    const action = setToDoListsAC([
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
    ])

    const startState = {
        todolistId1: [],
        todolistId2: []
    }

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(4)
    expect(endState[newKey]).toEqual([])
})


test('tasks should be set ', () => {
    const action = setTasksAC('todolistId1', [
        {
            id: '1', title: 'CSS',
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
            id: '2', title: 'JS', status: TasksStatuses.Completed,
            priority: TasksPriorities.Low,
            deadline: '',
            order: 0,
            startDate: '',
            description: 'Hello',
            addedDate: '',
            todoListId: 'TodolistId'
        }
    ])

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(2)
})

