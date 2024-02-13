import {v1} from 'uuid'
import {ToDoListType} from '../App'
import {todolistReducer} from './todolists-reducer'


test('correct todolist should be removed', () => {
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    const startState: ToDoListType[] = [
        {id: toDoListID1, title: 'What to learn', filter: 'all'},
        {id: toDoListID2, title: 'What to read', filter: 'all'}
    ]

    const endState = todolistReducer(startState, {type: 'REMOVE-TODOLIST', id: toDoListID1})

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

    const endState = todolistReducer(startState, {type: 'ADD-TODOLIST', title: newTodolistTitle})

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

    const action = {
        type: 'CHANGE-TODOLIST-TITLE',
        id: toDoListID2,
        title: newTodolistTitle
    }

    const endState = todolistReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})