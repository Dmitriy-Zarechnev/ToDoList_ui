import {v1} from 'uuid'
import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, FilterValuesType, removeTodolistAC, ToDoListDomainType, todolistsReducer} from '../todolists-reducer'

let toDoListID1: string
let toDoListID2: string
let startState: ToDoListDomainType[]

beforeEach(() => {
    toDoListID1 = v1()
    toDoListID2 = v1()

    startState = [
        {
            id: toDoListID1,
            title: 'What to learn',
            filter: 'all',
            addedDate: '',
            order: 0
        },
        {
            id: toDoListID2,
            title: 'What to read',
            filter: 'all',
            addedDate: '',
            order: 0
        }
    ]
})


test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, removeTodolistAC(toDoListID1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(toDoListID2)
})


test('correct todolist should be added', () => {
    const newTodolistTitle = 'New Todolist'

    const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle, 'todolistId'))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTodolistTitle)
})


test('correct todolist should change its name', () => {
    const newTodolistTitle = 'New TodoList'

    const endState = todolistsReducer(startState, changeTodolistTitleAC(toDoListID2, newTodolistTitle))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})


test('correct filter of todolist should be changed', () => {
    const newFilter: FilterValuesType = 'completed'

    const endState = todolistsReducer(startState, changeTodolistFilterAC(toDoListID2, newFilter))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

