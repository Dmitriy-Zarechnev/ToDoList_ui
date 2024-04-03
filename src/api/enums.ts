// Создаем enum для Status
export enum TasksStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

// Создаем enum для Priority
export enum TasksPriorities {
    Low = 0,
    Middle = 1,
    Hight = 2,
    Urgently = 3,
    Later = 4,
}

// Создаем enum для ResultCode
export enum ResultCode {
    success = 0,
    error = 1,
    captcha = 10,
}