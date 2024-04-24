import {ResponseType} from './todolist-api'
import {instance} from "common/api/common.api"
import {TasksPriorities, TasksStatuses} from "common/api/enums"

// ----- Типизация Get запроса ------
export type GetTaskType = {
    items: Array<TasksType>;
    totalCount: number;
    error: string;
};

// ----- Типизация Task ------
export type TasksType = {
    addedDate: string;
    deadline: string;
    description: string;
    id: string;
    order: number;
    priority: TasksPriorities;
    startDate: string;
    status: TasksStatuses;
    title: string;
    todoListId: string;
};

// ----- Типизация запроса update ------
type UpdateTaskModelType = {
    deadline: string;
    description: string;
    priority: number;
    startDate: string;
    status: number;
    title: string;
};


export const tasksAPI = {
    // ----- Запросили tasks с сервера ------
    getTasks(todolistId: string) {
        return instance.get<GetTaskType>(`todo-lists/${todolistId}/tasks`)
            .then((res) => res.data) // getTasksData
    },

    // ----- Загрузили task на сервер ------
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TasksType }>>(`todo-lists/${todolistId}/tasks`, {title})
            .then((res) => res.data) // addTaskData
    },

    // ----- Заменили task's title на сервере ------
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
            .then((res) => res.data) // updateTaskData
    },

    // ----- Удалили task на сервере ------
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
            .then((res) => res.data) // deleteTaskData
    }
}
