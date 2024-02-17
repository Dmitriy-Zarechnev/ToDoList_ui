import {v1} from 'uuid'
import {FilterValuesType, ToDoListType} from '../App'
import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC, todolistReducer} from './todolists-reducer'


test('correct todolist should be removed', () => {
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    const startState: ToDoListType[] = [
        {id: toDoListID1, title: 'What to learn', filter: 'all'},
        {id: toDoListID2, title: 'What to read', filter: 'all'}
    ]

    const endState = todolistReducer(startState, removeTodolistAC(toDoListID1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(toDoListID2)
})

test('correct todolist should be added', () => {
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    const startState: ToDoListType[] = [
        {id: toDoListID1, title: 'What to learn', filter: 'all'},
        {id: toDoListID2, title: 'What to read', filter: 'all'}
    ]
    const newTodolistTitle = 'New Todolist'

    const endState = todolistReducer(startState, addTodolistAC(newTodolistTitle, 'todolistId'))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTodolistTitle)
})

test('correct todolist should change its name', () => {
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    const startState: ToDoListType[] = [
        {id: toDoListID1, title: 'What to learn', filter: 'all'},
        {id: toDoListID2, title: 'What to read', filter: 'all'}
    ]
    const newTodolistTitle = 'New TodoList'

    const endState = todolistReducer(startState, changeTodolistTitleAC(toDoListID2, newTodolistTitle))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    const startState: ToDoListType[] = [
        {id: toDoListID1, title: 'What to learn', filter: 'all'},
        {id: toDoListID2, title: 'What to read', filter: 'all'}
    ]
    const newFilter: FilterValuesType = 'completed'

    const endState = todolistReducer(startState, changeTodolistFilterAC(toDoListID2, newFilter))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

