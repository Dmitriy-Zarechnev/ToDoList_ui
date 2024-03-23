import {tasksReducer, TasksStateType} from '../reducers/tasks-reducer'
import {addTodolistAC, ToDoListDomainType, todolistsReducer} from '../reducers/todolists-reducer'

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<ToDoListDomainType> = []

    const action = addTodolistAC('new todolist','todolistId3')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})


