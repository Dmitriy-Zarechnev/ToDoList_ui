import axios from 'axios'

// ----- Типизация Get запроса ------
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
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
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'd9bbcdc0-0dbd-4e98-ab2c-6652c2ba0fb0'
    }
})


export const todolistAPI = {
    // ----- Запросили todolists с сервера ------
    getTodolists() {
        return instance.get<TodolistType[]>(`todo-lists/`).then(res=>res.data) // toDoListsData
    },

    // ----- Загрузили todolist на сервер ------
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>(`todo-lists/`, {title})
    },

    // ----- Заменили todolists's title на сервере ------
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },

    // ----- Удалили todolists на сервере ------
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    }
}