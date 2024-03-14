import axios from 'axios'

// ----- Типизация Get запроса ------
export type GetTaskType = {
    items: Array<ItemsType>,
    totalCount: number,
    error: string
}

// ----- Типизация Task ------
export type ItemsType = {
    addedDate: Date,
    deadline: Date,
    description: string,
    id: string,
    order: number,
    priority: number,
    startDate: Date,
    status: number,
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
    deadline: Date,
    description: string,
    priority: number,
    startDate: Date,
    status: number,
    title: string
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
    },

    // ----- Загрузили task на сервер ------
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: ItemsType }>>(`${todolistId}/tasks`, {title})
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