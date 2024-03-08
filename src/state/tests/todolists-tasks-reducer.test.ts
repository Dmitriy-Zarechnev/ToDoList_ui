import {tasksReducer} from '../tasks-reducer'
import {TasksStateType, ToDoListType} from '../../App'
import {addTodolistAC,  todolistsReducer} from '../todolists-reducer'

test('id should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<ToDoListType> = []

    const action = addTodolistAC('new todolist','todolistId3')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})


