import {addTodolistAC, changeTodolistEntityStatusAC, clearToDoDataAC, removeTodolistAC, setToDoListsAC} from './todolists-reducer'
import {AppDispatch, AppRootStateType} from '../store'
import {tasksAPI, TasksStatuses, TasksType} from 'api/tasks-api'
import {RequestStatusType, setAppStatusAC} from './app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'


// Типизация TaskWithEntityType
export type TaskWithEntityType = TasksType & { entityTaskStatus: RequestStatusType }

// Типизация TasksInitialStateType
export type TasksInitialStateType = {
    [key: string]: Array<TaskWithEntityType>;
};

// Типизировали createAsyncThunk и внутри state, dispatch, rejectValue
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue: null
}>()

// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение tasks с сервера -----------------------
export const getTasksTC = createAppAsyncThunk<{
    toDoListID: string, tasks: TasksType[]
}, string>(
    // 1 - prefix
    'tasks/getTasks',
    // 2 - callback (условно наша старая санка), в которую:
    // Первым параметром мы передаем параметры необходимые для санки
    // (если параметров больше чем один упаковываем их в объект)
    // Вторым параметром thunkAPI, обратившись к которому получим dispatch ...
    async (toDoListID, thunkAPI) => {
        // 3 - деструктурируем параметры именно так. В дальнейшем пригодится такая запись
        const {dispatch, rejectWithValue} = thunkAPI

        // Показываем Preloader во время запроса
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            // Запрос на получение tasks с сервера
            const getTasksData = await tasksAPI.getTasks(toDoListID)

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({status: 'succeeded'}))

            // return ответ от сервера
            return {toDoListID, tasks: getTasksData.items}
        } catch (error) {
            // Обработка сетевой ошибки
            handleServerNetworkError(error, dispatch)
            // Здесь будет упакована ошибка
            return rejectWithValue(null)
        }
    })

// ------------- Добавление task -----------------------
export const addTaskTC = createAppAsyncThunk<{
    task: TaskWithEntityType
}, { toDoListID: string, title: string }>(
    // 1 - prefix
    'tasks/addTask',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async ({toDoListID, title}, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue} = thunkAPI

        // Показываем Preloader во время запроса
        dispatch(setAppStatusAC({status: 'loading'}))
        // Отключаем кнопку во время запроса
        dispatch(changeTodolistEntityStatusAC({toDoListID, entityStatus: 'loading'}))

        try {
            // Запрос на добавление task
            const addTaskData = await tasksAPI.createTask(toDoListID, title)

            // Если успех
            if (addTaskData.resultCode === 0) {

                // Убираем Preloader после успешного ответа
                dispatch(setAppStatusAC({status: 'updated'}))
                // Включаем кнопку после успешного ответа
                dispatch(changeTodolistEntityStatusAC({toDoListID, entityStatus: 'idle'}))

                // Return ответ от сервера и прибавили entityTaskStatus
                return {task: {...addTaskData.data.item, entityTaskStatus: 'idle'}}
            } else {
                // Обработка серверной ошибки
                handleServerNetworkError(addTaskData, dispatch)
                // Здесь будет упакована ошибка
                return rejectWithValue(null)
            }
        } catch (error: any) {
            // Обработка сетевой ошибки
            handleServerNetworkError(error, dispatch)
            // Здесь будет упакована ошибка
            return rejectWithValue(null)
        }
    }
)


// ------------- Удаление task -----------------------
export const deleteTaskTC = createAppAsyncThunk<{
    toDoListID: string, taskId: string
}, { toDoListID: string, taskId: string }>(
    // 1 - prefix
    'tasks/deleteTask',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async ({toDoListID, taskId}, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue} = thunkAPI

        // Показываем Preloader во время запроса
        dispatch(setAppStatusAC({status: 'loading'}))
        // Отключаем кнопку во время запроса
        dispatch(changeTaskEntityStatusAC({toDoListID, taskId, entityTaskStatus: 'loading'}))

        try {
            // Запрос на удаление task
            const deleteTaskData = await tasksAPI.deleteTask(toDoListID, taskId)

            // Если успех
            if (deleteTaskData.resultCode === 0) {

                // Убираем Preloader после успешного ответа
                dispatch(setAppStatusAC({status: 'updated'}))
                // Включили после успеха
                dispatch(changeTaskEntityStatusAC({toDoListID, taskId, entityTaskStatus: 'idle'}))

                // Return после ответа от сервера и удалили task
                return {toDoListID, taskId}
            } else {
                // Обработка серверной ошибки
                handleServerNetworkError(deleteTaskData, dispatch)
                // Здесь будет упакована ошибка
                return rejectWithValue(null)
            }
        } catch (error) {
            // Обработка сетевой ошибки
            handleServerNetworkError(error, dispatch)
            // Здесь будет упакована ошибка
            return rejectWithValue(null)
        }
    })


// ------------- Изменение task's status -----------------------
export const updateTaskStatusTC = createAppAsyncThunk<{
    toDoListID: string, taskId: string, status: TasksStatuses
}, { toDoListID: string, taskId: string, status: TasksStatuses }>(
    // 1 - prefix
    'tasks/updateTaskStatus',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async ({toDoListID, taskId, status}, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue, getState} = thunkAPI

        // Получили все tasks из state
        const allTasksFromState = getState().tasks

        // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
        const task = allTasksFromState[toDoListID].find((t) => {
            return t.id === taskId
        })

        // Проверка, т.к find может вернуть undefined
        if (task) {
            // Показываем Preloader во время запроса
            dispatch(setAppStatusAC({status: 'loading'}))
            // Отключаем кнопку во время запроса
            dispatch(changeTaskEntityStatusAC({toDoListID, taskId, entityTaskStatus: 'loading'}))

            try {
                // Запрос на изменение task's status
                const updateTaskData = await tasksAPI.updateTask(toDoListID, taskId, {
                    title: task.title,
                    startDate: task.startDate,
                    priority: task.priority,
                    description: task.description,
                    deadline: task.deadline,
                    status: status
                })

                // Если успех
                if (updateTaskData.resultCode === 0) {

                    // Убираем Preloader после успешного ответа
                    dispatch(setAppStatusAC({status: 'updated'}))
                    // Включили после успеха
                    dispatch(changeTaskEntityStatusAC({toDoListID, taskId, entityTaskStatus: 'idle'}))

                    // Dispatch после ответа от сервера и поменяли status
                    return {toDoListID, taskId, status}
                } else {
                    // Обработка серверной ошибки
                    handleServerNetworkError(updateTaskData, dispatch)
                    // Здесь будет упакована ошибка
                    return rejectWithValue(null)
                }
            } catch (error: any) {
                // Обработка сетевой ошибки
                handleServerNetworkError(error, dispatch)
                // Здесь будет упакована ошибка
                return rejectWithValue(null)
            }
        }
        // Здесь будет упакована ошибка
        return rejectWithValue(null)
    }
)

// ------------- Изменение tasks title -----------------------
export const updateTaskTitleTC =
    (todolistId: string, taskId: string, title: string) =>
        async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
            // Получили все tasks из state
            const allTasksFromState = getState().tasks

            // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
            const task = allTasksFromState[todolistId].find((t) => {
                return t.id === taskId
            })

            // Проверка, т.к find может вернуть undefined
            if (task) {
                // Показываем Preloader во время запроса
                dispatch(setAppStatusAC({status: 'loading'}))
                // Отключаем кнопку во время запроса
                dispatch(changeTaskEntityStatusAC({toDoListID: todolistId, taskId, entityTaskStatus: 'loading'}))

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
                        // Dispatch после ответа от сервера и поменяли title
                        dispatch(changeTaskTitleAC({toDoListID: todolistId, id: taskId, title}))

                        // Убираем Preloader после успешного ответа
                        dispatch(setAppStatusAC({status: 'updated'}))
                        // Включили после успеха
                        dispatch(changeTaskEntityStatusAC({toDoListID: todolistId, taskId, entityTaskStatus: 'idle'}))
                    } else {
                        // Обработка серверной ошибки
                        handleServerNetworkError(updateTaskData, dispatch)
                    }
                } catch (error: any) {
                    // Обработка сетевой ошибки
                    handleServerNetworkError(error, dispatch)
                }
            }
        }

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
    // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
    name: 'tasks',
    initialState: {} as TasksInitialStateType,
    // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
    reducers: {
        // removeTaskAC: (state,
        //                action: PayloadAction<{ toDoListID: string, id: string }>) => {
        //     const tasks = state[action.payload.toDoListID]
        //     const index = tasks.findIndex(el => el.id === action.payload.id)
        //     if (index > -1) {
        //         tasks.splice(index, 1)
        //     }
        // },
        // addTaskAC: (state,
        //             action: PayloadAction<{ task: TaskWithEntityType }>) => {
        //   const tasks = state[action.payload.task.todoListId];
        //   tasks.unshift(action.payload.task);
        // },
        // changeTaskStatusAC: (state,
        //                      action: PayloadAction<{ toDoListID: string, id: string, status: TasksStatuses }>) => {
        //     const tasks = state[action.payload.toDoListID]
        //     const index = tasks.findIndex(el => el.id === action.payload.id)
        //     if (index > -1) {
        //         tasks[index].status = action.payload.status
        //     }
        // },
        changeTaskTitleAC: (state,
                            action: PayloadAction<{ toDoListID: string, id: string, title: string }>) => {
            const tasks = state[action.payload.toDoListID]
            const index = tasks.findIndex(el => el.id === action.payload.id)
            if (index > -1) {
                tasks[index].title = action.payload.title
            }
        },
        // setTasksAC: (state,
        //              action: PayloadAction<{ toDoListID: string, tasks: Array<TasksType> }>) => {
        //   state[action.payload.toDoListID] = action.payload.tasks.map(el => {
        //     return { ...el, entityTaskStatus: "idle" };
        //   });
        // },
        changeTaskEntityStatusAC: (state,
                                   action: PayloadAction<{
                                       toDoListID: string,
                                       taskId: string,
                                       entityTaskStatus: RequestStatusType
                                   }>) => {
            const tasks = state[action.payload.toDoListID]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks[index].entityTaskStatus = action.payload.entityTaskStatus
            }
        }
    },
    // Общие reducers с другими
    extraReducers: builder => {
        builder
            .addCase(addTodolistAC,
                (state, action) => {
                    state[action.payload.toDoListID] = []
                })
            .addCase(removeTodolistAC,
                (state, action) => {
                    delete state[action.payload.toDoListID]
                })
            .addCase(setToDoListsAC,
                (state, action) => {
                    action.payload.toDoLists.forEach((el) => {
                        state[el.id] = []
                    })
                })
            .addCase(clearToDoDataAC,
                (state) => {
                    Object.keys(state).forEach(el => {
                        delete state[el]
                    })
                })
            .addCase(getTasksTC.fulfilled,
                (state, action) => {
                    if (action.payload) {
                        state[action.payload.toDoListID] = action.payload.tasks.map(el => {
                            return {...el, entityTaskStatus: 'idle'}
                        })
                    }
                })
            .addCase(addTaskTC.fulfilled,
                (state, action) => {
                    if (action.payload) {
                        const tasks = state[action.payload.task.todoListId]
                        tasks.unshift(action.payload.task)
                    }
                })
            .addCase(deleteTaskTC.fulfilled,
                (state, action) => {
                    if (action.payload) {
                        const tasks = state[action.payload.toDoListID]
                        const index = tasks.findIndex(el => el.id === action.payload.taskId)
                        if (index > -1) {
                            tasks.splice(index, 1)
                        }
                    }
                })
            .addCase(updateTaskStatusTC.fulfilled,
                (state, action) => {
                    if (action.payload) {
                        const tasks = state[action.payload.toDoListID]
                        const index = tasks.findIndex(el => el.id === action.payload.taskId)
                        if (index > -1) {
                            tasks[index].status = action.payload.status
                        }
                    }
                })
    }
})


// Создаем tasksReducer с помощью slice
export const tasksReducer = slice.reducer
// Action creators достаем с помощью slice и деструктуризации
export const {
    // removeTaskAC,
    // addTaskAC,
    // changeTaskStatusAC,
    changeTaskTitleAC,
    // setTasksAC,
    changeTaskEntityStatusAC
} = slice.actions
// Thunks упаковываем в объект
export const tasksThunks = {getTasksTC}


/*
// Типизация Actions всего tasksReducer
export type TasksActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof changeTaskEntityStatusAC>


// Типизация TasksArray
export type TasksInitialStateType = {
  [key: string]: Array<TasksType & { entityTaskStatus: RequestStatusType }>;
};

// Константы для работы с action в tasksReducer
const REMOVE_TASK = "TASKS/REMOVE-TASK";
const ADD_TASK = "TASKS/ADD-TASK";
const CHANGE_TASK_STATUS = "TASKS/CHANGE-TASK-STATUS";
const CHANGE_TASK_TITLE = "TASKS/CHANGE-TASK-TITLE";
const SET_TASKS = "TASKS/SET-TASKS";
const CHANGE_TASK_ENTITY_STATUS = "TASKS/CHANGE-TASK-ENTITY-STATUS";

// *********** Первоначальный state для tasksReducer ****************
const initialState: TasksInitialStateType = {};

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const tasksReducer = (state = initialState, action: any): TasksInitialStateType => {
  switch (action.type) {
    case REMOVE_TASK:
      return {
        ...state,
        [action.payload.toDoListID]: state[action.payload.toDoListID].filter((el) => el.id !== action.payload.id)
      };

    case ADD_TASK:
      return {
        ...state,
        [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
      };

    case CHANGE_TASK_STATUS:
      return {
        ...state,
        [action.payload.toDoListID]: state[action.payload.toDoListID].map((el) =>
          el.id !== action.payload.id ? el : { ...el, status: action.payload.status }
        )
      };

    case CHANGE_TASK_TITLE:
      return {
        ...state,
        [action.payload.toDoListID]: state[action.payload.toDoListID].map((el) =>
          el.id !== action.payload.id ? el : { ...el, title: action.payload.title }
        )
      };

    case addTodolistAC.type:
      return {
        ...state,
        [action.payload.toDoListID]: []
      };

    case removeTodolistAC.type:
      const newState = { ...state };
      delete newState[action.payload.toDoListID];
      return newState;

    case setToDoListsAC.type: {
      const newState = { ...state };
      action.payload.toDoLists.forEach((el: any) => {
        newState[el.id] = [];
      });
      return newState;
    }

    case SET_TASKS: {
      const newState = { ...state };
      newState[action.payload.toDoListID] = action.payload.tasks.map((el: any) => ({ ...el, entityTaskStatus: "idle" }));
      return newState;
    }

    case CHANGE_TASK_ENTITY_STATUS:
      return {
        ...state,
        [action.payload.toDoListID]: state[action.payload.toDoListID].map((el) =>
          el.id !== action.payload.id ? el : { ...el, entityTaskStatus: action.payload.entityTaskStatus }
        )
      };

    case clearToDoDataAC.type:
      return {};

    default:
      return state;
  }
};

// *********** Action creators - создают объект action ****************
export const removeTaskAC = (toDoListID: string, id: string) => {
  return { type: REMOVE_TASK, payload: { toDoListID, id } } as const;
};
export const addTaskAC = (task: TasksType & { entityTaskStatus: RequestStatusType }) => {
  return { type: ADD_TASK, payload: { task } } as const;
};
export const changeTaskStatusAC = (toDoListID: string, id: string, status: TasksStatuses) => {
  return { type: CHANGE_TASK_STATUS, payload: { toDoListID, id, status } } as const;
};
export const changeTaskTitleAC = (toDoListID: string, id: string, title: string) => {
  return { type: CHANGE_TASK_TITLE, payload: { toDoListID, id, title } } as const;
};
export const setTasksAC = (toDoListID: string, tasks: Array<TasksType>) => {
  return { type: SET_TASKS, payload: { toDoListID, tasks } } as const;
};
export const changeTaskEntityStatusAC = (toDoListID: string, id: string, entityTaskStatus: RequestStatusType) => {
  return { type: CHANGE_TASK_ENTITY_STATUS, payload: { toDoListID, id, entityTaskStatus } } as const;
};
 */

// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение tasks с сервера -----------------------
/*
export const getTasksTC = (todolistId: string) => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));

  try {
    // Запрос на получение tasks с сервера
    const getTasksData = await tasksAPI.getTasks(todolistId);

    // Dispatch ответ от сервера
    dispatch(setTasksAC({ toDoListID: todolistId, tasks: getTasksData.items }));

    // Убираем Preloader после успешного ответа
    dispatch(setAppStatusAC({ status: "succeeded" }));
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

 */
/*
// ------------- Удаление task -----------------------
export const deleteTaskTC = (todolistId: string, taskId: string) => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));
  // Отключаем кнопку во время запроса
  dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "loading" }));

  try {
    // Запрос на удаление task
    const deleteTaskData = await tasksAPI.deleteTask(todolistId, taskId);

    // Если успех
    if (deleteTaskData.resultCode === 0) {
      // Dispatch после ответа от сервера и удалили task
      dispatch(removeTaskAC({ toDoListID: todolistId, id: taskId }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC({ status: "updated" }));
      // Включили после успеха
      dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "idle" }));
    } else {
      // Обработка серверной ошибки
      handleServerNetworkError(deleteTaskData, dispatch);
    }
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

 */
/*
// ------------- Добавление task -----------------------
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));
  // Отключаем кнопку во время запроса
  dispatch(changeTodolistEntityStatusAC({ toDoListID: todolistId, entityStatus: "loading" }));

  try {
    // Запрос на добавление task
    const addTaskData = await tasksAPI.createTask(todolistId, title);

    // Если успех
    if (addTaskData.resultCode === 0) {
      // Dispatch ответ от сервера и прибавили entityTaskStatus
      dispatch(addTaskAC({ task: { ...addTaskData.data.item, entityTaskStatus: "idle" } }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC({ status: "updated" }));
      // Включаем кнопку после успешного ответа
      dispatch(changeTodolistEntityStatusAC({ toDoListID: todolistId, entityStatus: "idle" }));
    } else {
      // Обработка серверной ошибки
      handleServerNetworkError(addTaskData, dispatch);
    }
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

 */
/*
// ------------- Изменение task's status -----------------------
export const updateTaskStatusTC =
    (todolistId: string, taskId: string, status: TasksStatuses) =>
        async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
            // Получили все tasks из state
            const allTasksFromState = getState().tasks

            // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
            const task = allTasksFromState[todolistId].find((t) => {
                return t.id === taskId
            })

            // Проверка, т.к find может вернуть undefined
            if (task) {
                // Показываем Preloader во время запроса
                dispatch(setAppStatusAC({status: 'loading'}))
                // Отключаем кнопку во время запроса
                dispatch(changeTaskEntityStatusAC({toDoListID: todolistId, taskId, entityTaskStatus: 'loading'}))

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

                    // Если успех
                    if (updateTaskData.resultCode === 0) {
                        // Dispatch после ответа от сервера и поменяли status
                        dispatch(changeTaskStatusAC({toDoListID: todolistId, id: taskId, status}))

                        // Убираем Preloader после успешного ответа
                        dispatch(setAppStatusAC({status: 'updated'}))
                        // Включили после успеха
                        dispatch(changeTaskEntityStatusAC({toDoListID: todolistId, taskId, entityTaskStatus: 'idle'}))
                    } else {
                        // Обработка серверной ошибки
                        handleServerNetworkError(updateTaskData, dispatch)
                    }
                } catch (error: any) {
                    // Обработка сетевой ошибки
                    handleServerNetworkError(error, dispatch)
                }
            }
        }


 */
/*
// ------------- Изменение tasks title -----------------------
export const updateTaskTitleTC =
    (todolistId: string, taskId: string, title: string) =>
        async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
            // Получили все tasks из state
            const allTasksFromState = getState().tasks

            // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
            const task = allTasksFromState[todolistId].find((t) => {
                return t.id === taskId
            })

            // Проверка, т.к find может вернуть undefined
            if (task) {
                // Показываем Preloader во время запроса
                dispatch(setAppStatusAC({status: 'loading'}))
                // Отключаем кнопку во время запроса
                dispatch(changeTaskEntityStatusAC({toDoListID: todolistId, taskId, entityTaskStatus: 'loading'}))

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
                        // Dispatch после ответа от сервера и поменяли title
                        dispatch(changeTaskTitleAC({toDoListID: todolistId, id: taskId, title}))

                        // Убираем Preloader после успешного ответа
                        dispatch(setAppStatusAC({status: 'updated'}))
                        // Включили после успеха
                        dispatch(changeTaskEntityStatusAC({toDoListID: todolistId, taskId, entityTaskStatus: 'idle'}))
                    } else {
                        // Обработка серверной ошибки
                        handleServerNetworkError(updateTaskData, dispatch)
                    }
                } catch (error: any) {
                    // Обработка сетевой ошибки
                    handleServerNetworkError(error, dispatch)
                }
            }
        }
 */