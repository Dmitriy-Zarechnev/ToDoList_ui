import axios from 'axios'

// ----- Типизация Get запроса ------
export type GetTaskType = {
    items: Array<TasksType>,
    totalCount: number,
    error: string
}

// ----- Типизация Task ------
export type TasksType = {
    addedDate: string,
    deadline: string,
    description: string,
    id: string,
    order: number,
    priority: TasksPriorities,
    startDate: string,
    status: TasksStatuses,
    title: string
    todoListId: string
}

// ----- Типизация ошибок при запросе ------
type FieldErrorType = {
    error: string
    field: string
}

// ----- Типизация запросов с generic ------
type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: D
}

// ----- Типизация запроса update ------
type UpdateTaskModelType = {
    deadline: string,
    description: string,
    priority: number,
    startDate: string,
    status: number,
    title: string
}

// Создаем enum для Status
export enum TasksStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

// Создаем enum для Priority
export enum TasksPriorities {
    Low = 0,
    Middle = 1,
    Hight = 2,
    Urgently = 3,
    Later = 4
}

// ----- Объект экземпляр для избежания дублирования ------
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/todo-lists/',
    withCredentials: true,
    headers: {
        'API-KEY': 'd9bbcdc0-0dbd-4e98-ab2c-6652c2ba0fb0'
    }
})


export const tasksAPI = {
    // ----- Запросили tasks с сервера ------
    getTasks(todolistId: string) {
        return instance.get<GetTaskType>(`${todolistId}/tasks`)
            .then(res => res.data)// getTasksData
    },

    // ----- Загрузили task на сервер ------
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TasksType }>>(`${todolistId}/tasks`, {title})
            .then(res => res.data) // addTaskData
    },

    // ----- Заменили task's title на сервере ------
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`${todolistId}/tasks/${taskId}`, model)
    },

    // ----- Удалили task на сервере ------
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todolistId}/tasks/${taskId}`)
    }
}