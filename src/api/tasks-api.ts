import axios from 'axios'

// ----- Типизация Get запроса ------
type GetTaskType = {
    items: Array<ItemsType>,
    totalCount: number,
    error: string
}

// ----- Типизация Task ------
type ItemsType = {
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
    updateTaskTitle(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType>(`${todolistId}/tasks/${taskId}`, {title})
    },

    /*
    // ----- Заменили task's completed на сервере ------
    updateTaskCompleted(todolistId: string, taskId: string, completed: boolean) {
        return instance.put(`${todolistId}/tasks/${taskId}`, {completed})
    },
    */

    // ----- Удалили task на сервере ------
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todolistId}/tasks/${taskId}`)
    }
}