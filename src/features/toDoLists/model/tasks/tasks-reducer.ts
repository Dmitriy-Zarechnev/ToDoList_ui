import { createAppAsyncThunk, toDoListsActions, toDoListsThunks } from "../toDoLists/todolists-reducer";
import { tasksAPI, TasksType } from "features/toDoLists/api/tasks-api";
import { RequestStatusType } from "app/model/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode, TasksStatuses } from "utils/api/enums";


// Типизация TaskWithEntityType
export type TaskWithEntityType = TasksType & { entityTaskStatus: RequestStatusType }

// Типизация TasksInitialStateType
export type TasksInitialStateType = {
  [key: string]: Array<TaskWithEntityType>;
};


// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
  // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
  name: "tasks",
  initialState: {} as TasksInitialStateType,
  // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
  reducers: {
    changeTaskEntityStatus: (state,
                             action: PayloadAction<{
                               toDoListID: string,
                               taskId: string,
                               entityTaskStatus: RequestStatusType
                             }>) => {
      const tasks = state[action.payload.toDoListID];
      const index = tasks.findIndex(el => el.id === action.payload.taskId);
      if (index > -1) {
        tasks[index].entityTaskStatus = action.payload.entityTaskStatus;
      }
    }
  },
  // Общие reducers с другими
  extraReducers: builder => {
    builder
      .addCase(toDoListsThunks.addTodoLists.fulfilled,
        (state, action) => {
          state[action.payload.toDoListID] = [];
        })
      .addCase(toDoListsThunks.deleteTodoLists.fulfilled,
        (state, action) => {
          delete state[action.payload.toDoListID];
        })
      .addCase(toDoListsThunks.getTodoLists.fulfilled,
        (state, action) => {
          action.payload.toDoLists.forEach((tl) => {
            state[tl.id] = [];
          });
        })
      .addCase(toDoListsActions.clearToDoData,
        (state) => {
          Object.keys(state).forEach(el => {
            delete state[el];
          });
        })
      .addCase(getTasks.fulfilled,
        (state, action) => {
          state[action.payload.toDoListID] = action.payload.tasks.map(el => {
            return { ...el, entityTaskStatus: "idle" };
          });
        })
      .addCase(addTask.fulfilled,
        (state, action) => {
          if (action.payload) {
            const tasks = state[action.payload.task.todoListId];
            tasks.unshift(action.payload.task);
          }
        })
      .addCase(deleteTask.fulfilled,
        (state, action) => {
          const tasks = state[action.payload.toDoListID];
          const index = tasks.findIndex(el => el.id === action.payload.taskId);
          if (index > -1) {
            tasks.splice(index, 1);
          }
        })
      .addCase(updateTaskStatus.fulfilled,
        (state, action) => {
          const tasks = state[action.payload.toDoListID];
          const index = tasks.findIndex(el => el.id === action.payload.taskId);
          if (index > -1) {
            tasks[index].status = action.payload.status;
          }
        })
      .addCase(updateTaskTitle.fulfilled,
        (state, action) => {
          const tasks = state[action.payload.toDoListID];
          const index = tasks.findIndex(el => el.id === action.payload.taskId);
          if (index > -1) {
            tasks[index].title = action.payload.title;
          }
        });
  },
  // Selectors
  selectors: {
    selectTasks: (sliceState) => sliceState
  }
});


// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение tasks с сервера -----------------------
const getTasks = createAppAsyncThunk<{
  toDoListID: string, tasks: TasksType[]
}, string>(
  // 1 - prefix
  `${slice.name}/getTasks`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async (toDoListID, _) => {

    // Запрос на получение tasks с сервера
    const getTasksData = await tasksAPI.getTasks(toDoListID);


    // return ответ от сервера
    return { toDoListID, tasks: getTasksData.items };
  }
);


// ------------- Добавление task -----------------------
const addTask = createAppAsyncThunk<{
  task: TaskWithEntityType
}, { toDoListID: string, title: string }>(
  // 1 - prefix
  `${slice.name}/addTask`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async ({ toDoListID, title }, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue } = thunkAPI;

    // Отключаем кнопку во время запроса
    dispatch(toDoListsActions.changeTodolistEntityStatus({ toDoListID, entityStatus: "loading" }));

    // Запрос на добавление task
    const addTaskData = await tasksAPI.createTask(toDoListID, title);

    // Если успех
    if (addTaskData.resultCode === ResultCode.success) {

      // Включаем кнопку после успешного ответа
      dispatch(toDoListsActions.changeTodolistEntityStatus({ toDoListID, entityStatus: "idle" }));
      // Return ответ от сервера и прибавили entityTaskStatus
      return { task: { ...addTaskData.data.item, entityTaskStatus: "idle" } };
    } else {

      // Включаем кнопку после провала
      dispatch(toDoListsActions.changeTodolistEntityStatus({ toDoListID, entityStatus: "idle" }));
      // Здесь будет упакована ошибка
      return rejectWithValue(addTaskData);
    }
  }
);


// ------------- Удаление task -----------------------
const deleteTask = createAppAsyncThunk<{
  toDoListID: string, taskId: string
}, { toDoListID: string, taskId: string }>(
  // 1 - prefix
  `${slice.name}/deleteTask`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async ({ toDoListID, taskId }, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue } = thunkAPI;

    // Отключаем кнопку во время запроса
    dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "loading" }));

    // Запрос на удаление task
    const deleteTaskData = await tasksAPI.deleteTask(toDoListID, taskId);

    // Если успех
    if (deleteTaskData.resultCode === ResultCode.success) {

      // Включили после успеха
      dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "idle" }));

      // Return после ответа от сервера и удалили task
      return { toDoListID, taskId };
    } else {

      // Включили после провала
      dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "failed" }));
      // Здесь будет упакована ошибка
      return rejectWithValue(deleteTaskData);
    }
  }
);


// ------------- Изменение task's status -----------------------
const updateTaskStatus = createAppAsyncThunk<{
  toDoListID: string, taskId: string, status: TasksStatuses
}, { toDoListID: string, taskId: string, status: TasksStatuses }>(
  // 1 - prefix
  `${slice.name}/updateTaskStatus`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async ({ toDoListID, taskId, status }, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue, getState } = thunkAPI;

    // Получили все tasks из state
    const allTasksFromState = getState().tasks;

    // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
    const task = allTasksFromState[toDoListID].find((t) => {
      return t.id === taskId;
    });

    // Проверка, т.к find может вернуть undefined
    if (task) {
      // Отключаем кнопку во время запроса
      dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "loading" }));


      // Запрос на изменение task's status
      const updateTaskData = await tasksAPI.updateTask(toDoListID, taskId, {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: status
      });

      // Если успех
      if (updateTaskData.resultCode === ResultCode.success) {


        // Включили после успеха
        dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "idle" }));

        // Dispatch после ответа от сервера и поменяли status
        return { toDoListID, taskId, status };
      } else {

        // Включили после провала
        dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "failed" }));
        // Здесь будет упакована ошибка
        return rejectWithValue(updateTaskData);
      }
    }
    // Здесь будет упакована ошибка
    return rejectWithValue(null);
  }
);


// ------------- Изменение tasks title -----------------------
const updateTaskTitle = createAppAsyncThunk<{
  toDoListID: string, taskId: string, title: string
}, { toDoListID: string, taskId: string, title: string }>(
  // 1 - prefix
  `${slice.name}/updateTaskTitle`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async ({ toDoListID, taskId, title }, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue, getState } = thunkAPI;

    // Получили все tasks из state
    const allTasksFromState = getState().tasks;

    // Нашли нужные tasks по todolistId, а затем используя taskId нужную task
    const task = allTasksFromState[toDoListID].find((t) => {
      return t.id === taskId;
    });

    // Проверка, т.к find может вернуть undefined
    if (task) {

      // Отключаем кнопку во время запроса
      dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "loading" }));


      // Запрос на изменение task's title
      const updateTaskData = await tasksAPI.updateTask(toDoListID, taskId, {
        title: title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status
      });

      // Если успех
      if (updateTaskData.resultCode === ResultCode.success) {

        // Включили после успеха
        dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "idle" }));

        // Return после ответа и поменяли title
        return { toDoListID, taskId, title };
      } else {

        // Включили после провала
        dispatch(tasksActions.changeTaskEntityStatus({ toDoListID, taskId, entityTaskStatus: "failed" }));
        // Здесь будет упакована ошибка
        return rejectWithValue(updateTaskData);
      }
    }
    // Здесь будет упакована ошибка
    return rejectWithValue(null);
  }
);


// Создаем tasksReducer с помощью slice
export const tasksReducer = slice.reducer;

// Action creators достаем с помощью slice
export const tasksActions = slice.actions;
// Thunks упаковываем в объект
export const tasksThunks = { getTasks, addTask, deleteTask, updateTaskStatus, updateTaskTitle };

// Упаковали все selectors в один объект
export const tasksSelectors = slice.selectors;

