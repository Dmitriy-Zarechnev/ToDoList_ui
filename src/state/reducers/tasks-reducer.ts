import {
  changeTodolistEntityStatusAC, toDoListsActions
} from "./todolists-reducer";
import { AppDispatch, AppRootStateType } from "../store";
import { tasksAPI, TasksStatuses, TasksType } from "api/tasks-api";
import { RequestStatusType, setAppStatusAC } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Типизация TaskWithEntityType
export type TaskWithEntityType = TasksType & { entityTaskStatus: RequestStatusType }

// Типизация TasksInitialStateType
export type TasksInitialStateType = {
  [key: string]: Array<TaskWithEntityType>;
};

// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
  // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
  name: "tasks",
  initialState: {} as TasksInitialStateType,
  // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
  reducers: {
    removeTaskAC: (state,
                   action: PayloadAction<{ toDoListID: string, id: string }>) => {
      const tasks = state[action.payload.toDoListID];
      const index = tasks.findIndex(el => el.id === action.payload.id);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    },
    addTaskAC: (state,
                action: PayloadAction<{ task: TaskWithEntityType }>) => {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift(action.payload.task);
    },
    changeTaskStatusAC: (state,
                         action: PayloadAction<{ toDoListID: string, id: string, status: TasksStatuses }>) => {
      const tasks = state[action.payload.toDoListID];
      const index = tasks.findIndex(el => el.id === action.payload.id);
      if (index > -1) {
        tasks[index].status = action.payload.status;
      }
    },
    changeTaskTitleAC: (state,
                        action: PayloadAction<{ toDoListID: string, id: string, title: string }>) => {
      const tasks = state[action.payload.toDoListID];
      const index = tasks.findIndex(el => el.id === action.payload.id);
      if (index > -1) {
        tasks[index].title = action.payload.title;
      }
    },
    setTasksAC: (state,
                 action: PayloadAction<{ toDoListID: string, tasks: Array<TasksType> }>) => {
      state[action.payload.toDoListID] = action.payload.tasks.map(el => {
        return { ...el, entityTaskStatus: "idle" };
      });
    },
    changeTaskEntityStatusAC: (state,
                               action: PayloadAction<{
                                 toDoListID: string,
                                 id: string,
                                 entityTaskStatus: RequestStatusType
                               }>) => {
      const tasks = state[action.payload.toDoListID];
      const index = tasks.findIndex(el => el.id === action.payload.id);
      if (index > -1) {
        tasks[index].entityTaskStatus = action.payload.entityTaskStatus;
      }
    }
  },
  // Общие reducers с другими
  extraReducers: builder => {
    builder
      .addCase(toDoListsActions.addTodolistAC,
        (state, action) => {
          state[action.payload.toDoListID] = [];
        })
      .addCase(toDoListsActions.removeTodolistAC,
        (state, action) => {
          delete state[action.payload.toDoListID];
        })
      .addCase(toDoListsActions.setToDoListsAC,
        (state, action) => {
          action.payload.toDoLists.forEach((el) => {
            state[el.id] = [];
          });
        })
      .addCase(toDoListsActions.clearToDoDataAC,
        (state) => {
          Object.keys(state).forEach(el => {
            delete state[el];
          });
        });
  }
});


// Создаем tasksReducer с помощью slice
export const tasksReducer = slice.reducer;
// Action creators достаем с помощью slice
export const {
  removeTaskAC,
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  setTasksAC,
  changeTaskEntityStatusAC
} = slice.actions;


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
export const getTasksTC = (todolistId: string) => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));

  try {
    // Запрос на получение tasks с сервера
    const getTasksData = await tasksAPI.getTasks(todolistId);

    // Задиспатчили ответ от сервера
    dispatch(setTasksAC({ toDoListID: todolistId, tasks: getTasksData.items }));

    // Убираем Preloader после успешного ответа
    dispatch(setAppStatusAC({ status: "succeeded" }));
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

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
      // Задиспатчили после ответа от сервера и удалили task
      dispatch(removeTaskAC({ toDoListID: todolistId, id: taskId }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC({ status: "updated" }));
      // Включили после успеха
      dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "idle" }));
    } else {
      // Обработка серверной ошибки
      handleServerAppError(deleteTaskData, dispatch);
    }
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

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
      // Задиспатчили ответ от сервера и прибавили entityTaskStatus
      dispatch(addTaskAC({ task: { ...addTaskData.data.item, entityTaskStatus: "idle" } }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC({ status: "updated" }));
      // Включаем кнопку после успешного ответа
      dispatch(changeTodolistEntityStatusAC({ toDoListID: todolistId, entityStatus: "idle" }));
    } else {
      // Обработка серверной ошибки
      handleServerAppError(addTaskData, dispatch);
    }
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

// ------------- Изменение task's status -----------------------
export const updateTaskStatusTC =
  (todolistId: string, taskId: string, status: TasksStatuses) =>
    async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
      // Получили все tasks из state
      const allTasksFromState = getState().tasks;

      // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
      const task = allTasksFromState[todolistId].find((t) => {
        return t.id === taskId;
      });

      // Проверка, т.к find может вернуть undefined
      if (task) {
        // Показываем Preloader во время запроса
        dispatch(setAppStatusAC({ status: "loading" }));
        // Отключаем кнопку во время запроса
        dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "loading" }));

        try {
          // Запрос на изменение task's status
          const updateTaskData = await tasksAPI.updateTask(todolistId, taskId, {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: status
          });

          // Если успех
          if (updateTaskData.resultCode === 0) {
            // Задиспатчили после ответа от сервера и поменяли status
            dispatch(changeTaskStatusAC({ toDoListID: todolistId, id: taskId, status }));

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({ status: "updated" }));
            // Включили после успеха
            dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "idle" }));
          } else {
            // Обработка серверной ошибки
            handleServerAppError(updateTaskData, dispatch);
          }
        } catch (error: any) {
          // Обработка сетевой ошибки
          handleServerNetworkError(error, dispatch);
        }
      }
    };

// ------------- Изменение task's title -----------------------
export const updateTaskTitleTC =
  (todolistId: string, taskId: string, title: string) =>
    async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
      // Получили все tasks из state
      const allTasksFromState = getState().tasks;

      // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
      const task = allTasksFromState[todolistId].find((t) => {
        return t.id === taskId;
      });

      // Проверка, т.к find может вернуть undefined
      if (task) {
        // Показываем Preloader во время запроса
        dispatch(setAppStatusAC({ status: "loading" }));
        // Отключаем кнопку во время запроса
        dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "loading" }));

        try {
          // Запрос на изменение task's title
          const updateTaskData = await tasksAPI.updateTask(todolistId, taskId, {
            title: title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status
          });

          // Если успех
          if (updateTaskData.resultCode === 0) {
            // Задиспатчили после ответа от сервера и поменяли title
            dispatch(changeTaskTitleAC({ toDoListID: todolistId, id: taskId, title }));

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({ status: "updated" }));
            // Включили после успеха
            dispatch(changeTaskEntityStatusAC({ toDoListID: todolistId, id: taskId, entityTaskStatus: "idle" }));
          } else {
            // Обработка серверной ошибки
            handleServerAppError(updateTaskData, dispatch);
          }
        } catch (error: any) {
          // Обработка сетевой ошибки
          handleServerNetworkError(error, dispatch);
        }
      }
    };
