import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer, TasksStateType} from '../tasks-reducer'
import {addTodolistAC, removeTodolistAC, ToDoListDomainType, todolistsReducer} from '../todolists-reducer'
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


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<ToDoListDomainType> = []

    const action = addTodolistAC('new todolist', 'todolistId3')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})


test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})
