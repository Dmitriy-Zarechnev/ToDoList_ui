import {instance} from "utils/api/common.api"

// ----- Типизация Get запроса ------
export type TodolistType = {
    id: string;
    addedDate: string;
    order: number;
    title: string;
};

// ----- Типизация ошибок при запросе ------
export type FieldErrorType = {
    error: string;
    field: string;
};

// ----- Типизация запросов с generic ------
export type ResponseType<D = {}> = {
    resultCode: number;
    messages: string[];
    fieldsErrors: FieldErrorType[];
    data: D;
};


export const todolistAPI = {
    // ----- Запросили todolists с сервера ------
    getTodolists() {
        return instance.get<TodolistType[]>(`todo-lists/`)
            .then((res) => res.data) // toDoListsData
    },

    // ----- Загрузили todolist на сервер ------
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>(`todo-lists/`, {title})
            .then((res) => res.data) // addTodoListsData
    },

    // ----- Заменили todolists's title на сервере ------
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
            .then((res) => res.data) // updateTodolistData
    },

    // ----- Удалили todolists на сервере ------
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
            .then((res) => res.data) // deleteTodolistData
    }
}
