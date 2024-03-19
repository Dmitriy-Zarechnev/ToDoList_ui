import {AddTodolistActionType, changeTodolistEntityStatusAC, RemoveTodolistActionType, SetTodolistActionType} from './todolists-reducer'
import {AppRootStateType, AppThunkDispatch} from './store'
import {tasksAPI, TasksStatuses, TasksType} from '../api/tasks-api'
import { setAppStatusAC} from './app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils'

// Типизация Actions всего tasksReducer
export type TasksActionsType =
    ReturnType<typeof removeTaskAC> |
    ReturnType<typeof addTaskAC> |
    ReturnType<typeof changeTaskStatusAC> |
    ReturnType<typeof changeTaskTitleAC> |
    ReturnType<typeof setTasksAC> |
    AddTodolistActionType |
    RemoveTodolistActionType |
    SetTodolistActionType

// Типизация TasksArray
export type TasksStateType = {
    [key: string]: Array<TasksType>
}

// *********** Первоначальный state для tasksReducer ****************
const initialState: TasksStateType = {}

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID]
                    .filter(el => el.id !== action.payload.id)
            }

        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }

        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID]
                    .map(el => el.id !== action.payload.id
                        ? el
                        : {...el, status: action.payload.status})
            }

        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID]
                    .map(el => el.id !== action.payload.id
                        ? el
                        : {...el, title: action.payload.title})
            }

        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.payload.todolistId]: []
            }

        case 'REMOVE-TODOLIST':
            const newState = {...state}
            delete newState[action.payload.toDoListID]
            return newState

        case 'SET-TODOLISTS': {
            const newState = {...state}
            action.payload.toDoLists.forEach(el => {
                newState[el.id] = []
            })
            return newState
        }

        case 'SET-TASKS': {
            const newState = {...state}
            newState[action.payload.toDoListID] = [...action.payload.tasks]
            return newState
        }

        default :
            return state
    }
}

// *********** Action creators - создают объект action ****************
export const removeTaskAC = (toDoListID: string, id: string) => {
    return {type: 'REMOVE-TASK', payload: {toDoListID, id}} as const
}
export const addTaskAC = (task: TasksType) => {
    return {type: 'ADD-TASK', payload: {task}} as const
}
export const changeTaskStatusAC = (toDoListID: string, id: string, status: TasksStatuses) => {
    return {type: 'CHANGE-TASK-STATUS', payload: {toDoListID, id, status}} as const
}
export const changeTaskTitleAC = (toDoListID: string, id: string, title: string) => {
    return {type: 'CHANGE-TASK-TITLE', payload: {toDoListID, id, title}} as const
}
export const setTasksAC = (toDoListID: string, tasks: Array<TasksType>) => {
    return {type: 'SET-TASKS', payload: {toDoListID, tasks}} as const
}

// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение tasks с сервера -----------------------
export const getTasksTC = (todolistId: string) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))

    try {

        // Запрос на получение tasks с сервера
        const getTasksData = await tasksAPI.getTasks(todolistId)

        // Задиспатчили ответ от сервера
        dispatch(setTasksAC(todolistId, getTasksData.items))

        // Убираем Preloader после успешного ответа
        dispatch(setAppStatusAC('succeeded'))
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}

// ------------- Удаление task -----------------------
export const deleteTaskTC = (todolistId: string, taskId: string) =>
    async (dispatch: AppThunkDispatch) => {
        // Показываем Preloader во время запроса
        dispatch(setAppStatusAC('loading'))

        try {
            // Запрос на удаление task
            const deleteTaskData = await tasksAPI.deleteTask(todolistId, taskId)

            if (deleteTaskData.resultCode === 0) {
                // Задиспатчили после ответа от сервера и удалили task
                dispatch(removeTaskAC(todolistId, taskId))

                // Убираем Preloader после успешного ответа
                dispatch(setAppStatusAC('updated'))
            } else {
                handleServerAppError(deleteTaskData, dispatch)
            }
        } catch (error: any) {
            handleServerNetworkError(error, dispatch)
        }
    }

// ------------- Добавление task -----------------------
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: AppThunkDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC('loading'))
    // Отключаем кнопку во время запроса
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))

    try {
        // Запрос на добавление task
        const addTaskData = await tasksAPI.createTask(todolistId, title)

        // Если успех
        if (addTaskData.resultCode === 0) {
            // Задиспатчили ответ от сервера
            dispatch(addTaskAC(addTaskData.data.item))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC('updated'))
            // Включаем кнопку после успешного ответа
            dispatch(changeTodolistEntityStatusAC(todolistId, 'idle'))
        } else {
            handleServerAppError(addTaskData, dispatch)
            // // Проверили существование ошибки
            // addTaskData.messages.length
            //
            //     // Задиспатчили ошибку с сервера
            //     ? dispatch(setAppErrorAC(addTaskData.messages[0]))
            //
            //     // Задиспатчили ошибку свою
            //     : dispatch(setAppErrorAC('Some error occurred🤬'))
            //
            // // Изменили статус
            // dispatch(setAppStatusAC('failed'))
        }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)

        // dispatch(setAppErrorAC(error.toString()))
        // dispatch(setAppStatusAC('failed'))
    }
}

// ------------- Изменение task's status -----------------------
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TasksStatuses) =>
    async (dispatch: AppThunkDispatch, getState: () => AppRootStateType) => {
        // Получили все tasks из state
        const allTasksFromState = getState().tasks

        // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
        const task = allTasksFromState[todolistId].find(t => {
            return t.id === taskId
        })

        // Проверка, т.к find может вернуть undefined
        if (task) {
            // Показываем Preloader во время запроса
            dispatch(setAppStatusAC('loading'))
            try {
                // Запрос на изменение task's status
                const updateTaskData = await tasksAPI.updateTask(todolistId, taskId, {
                    title: task.title,
                    startDate: task.startDate,
                    priority: task.priority,
                    description: task.description,
                    deadline: task.deadline,
                    status: status
                })

                if (updateTaskData.resultCode === 0) {
                    // Задиспатчили после ответа от сервера и поменяли status
                    dispatch(changeTaskStatusAC(todolistId, taskId, status))

                    // Убираем Preloader после успешного ответа
                    dispatch(setAppStatusAC('updated'))
                } else {
                    handleServerAppError(updateTaskData, dispatch)
                }
            } catch (error: any) {
                handleServerNetworkError(error, dispatch)

                // dispatch(setAppErrorAC(error.toString()))
                // dispatch(setAppStatusAC('failed'))
            }
        }
    }

// ------------- Изменение task's title -----------------------
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) =>
    async (dispatch: AppThunkDispatch, getState: () => AppRootStateType) => {

        // Получили все tasks из state
        const allTasksFromState = getState().tasks

        // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
        const task = allTasksFromState[todolistId].find(t => {
            return t.id === taskId
        })

        // Проверка, т.к find может вернуть undefined
        if (task) {
            // Показываем Preloader во время запроса
            dispatch(setAppStatusAC('loading'))
            try {
                // Запрос на изменение task's title
                const updateTaskData = await tasksAPI.updateTask(todolistId, taskId, {
                    title: title,
                    startDate: task.startDate,
                    priority: task.priority,
                    description: task.description,
                    deadline: task.deadline,
                    status: task.status
                })


                // Если успех
                if (updateTaskData.resultCode === 0) {
                    // Задиспатчили после ответа от сервера и поменяли title
                    dispatch(changeTaskTitleAC(todolistId, taskId, title))

                    // Убираем Preloader после успешного ответа
                    dispatch(setAppStatusAC('updated'))
                } else {
                    handleServerAppError(updateTaskData, dispatch)
                    // // Проверили существование ошибки
                    // updateTaskData.messages.length
                    //
                    //     // Задиспатчили ошибку с сервера
                    //     ? dispatch(setAppErrorAC(updateTaskData.messages[0]))
                    //
                    //     // Задиспатчили ошибку свою
                    //     : dispatch(setAppErrorAC('Some error occurred🤬'))
                    //
                    // // Изменили статус
                    // dispatch(setAppStatusAC('failed'))
                }
            } catch (error: any) {
                handleServerNetworkError(error, dispatch)
                // dispatch(setAppErrorAC(error.toString()))
                // dispatch(setAppStatusAC('failed'))
            }
        }
    }