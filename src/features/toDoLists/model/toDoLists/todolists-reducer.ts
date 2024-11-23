import { AppDispatch, AppRootStateType } from "app/model/store";
import { ResponseType, todolistAPI, TodolistType } from "features/toDoLists/api/todolist-api";
import { RequestStatusType } from "app/model/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode } from "common/api/enums";


// Типизация Filters
export type FilterValuesType = "all" | "active" | "completed";

// Типизация ToDoLists объединенный с filter
export type ToDoListDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// Типизировали createAsyncThunk и внутри state, dispatch, rejectValue
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | ResponseType
}>();


// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
  // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
  name: "toDoLists",
  initialState: [] as ToDoListDomainType[],
  // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
  reducers: {
    changeTodolistFilter: (state,
                           action: PayloadAction<{ toDoListID: string, filter: FilterValuesType }>) => {
      const toDo =
        state.find(el => el.id === action.payload.toDoListID);

      if (toDo) {
        toDo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state,
                                 action: PayloadAction<{
                                   toDoListID: string,
                                   entityStatus: RequestStatusType
                                 }>) => {
      const toDo =
        state.find(el => el.id === action.payload.toDoListID);

      if (toDo) {
        toDo.entityStatus = action.payload.entityStatus;
      }
    },
    clearToDoData: (state) => {
      state.splice(0, state.length);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getTodoLists.fulfilled,
        (state, action) => {
          return action.payload.toDoLists.map(el => ({ ...el, filter: "all", entityStatus: "idle" }));
        })
      .addCase(updateTodoLists.fulfilled,
        (state, action) => {
          const toDo =
            state.find(el => el.id === action.payload.toDoListID);

          if (toDo) {
            toDo.title = action.payload.title;
          }
        })
      .addCase(addTodoLists.fulfilled,
        (state, action) => {
          state.unshift({
            id: action.payload.toDoListID,
            title: action.payload.title,
            filter: "all",
            addedDate: "",
            order: 0,
            entityStatus: "idle"
          });
        })
      .addCase(deleteTodoLists.fulfilled,
        (state, action) => {
          const index = state.findIndex(el => el.id === action.payload.toDoListID);
          if (index > -1) {
            state.splice(index, 1);
          }
        });
  },
  selectors: {
    selectToDoLists: (sliceState) => sliceState
  }
});


// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------
const getTodoLists = createAppAsyncThunk<{
  toDoLists: TodolistType[]
}>(
  // 1 - prefix
  `${slice.name}/getTodoLists`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async () => {

    // Запрос на получение todolist с сервера
    const getTodoListsData = await todolistAPI.getTodolists();

    // Return ответ от сервера
    return { toDoLists: getTodoListsData };
  }
);


// ------------- Изменение toDoList's title -----------------------
const updateTodoLists = createAppAsyncThunk<{
  toDoListID: string, title: string
}, { toDoListID: string, title: string }>(
  // 1 - prefix
  `${slice.name}/updateTodoLists`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async ({ toDoListID, title }, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { rejectWithValue, getState } = thunkAPI;

    // Получили все toDoLists из state
    const allTodoListsFromState = getState().toDoLists;

    // Нашли нужный todolist по todolistId
    const toDoList = allTodoListsFromState.find((t) => {
      return t.id === toDoListID;
    });

    // Проверка, т.к find может вернуть undefined
    if (toDoList) {

      // Запрос на изменение toDoList's title
      const updateTodolistData = await todolistAPI.updateTodolist(toDoListID, title);

      // Если успех
      if (updateTodolistData.resultCode === ResultCode.success) {

        // return после ответа от сервера и поменяли title
        return { toDoListID, title };
      } else {

        // Здесь будет упакована ошибка
        return rejectWithValue(updateTodolistData);
      }
    }

    // Здесь будет упакована ошибка
    return rejectWithValue(null);
  }
);


// ------------- Добавление нового todolist -----------------------
const addTodoLists = createAppAsyncThunk<{
  title: string, toDoListID: string
}, string>(
  // 1 - prefix
  `${slice.name}/addTodoLists`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async (title, { rejectWithValue }) => {

    // Запрос на добавление todolist
    const addTodoListsData = await todolistAPI.createTodolist(title);

    // Если успех
    if (addTodoListsData.resultCode === ResultCode.success) {

      // return ответ от сервера
      return { title, toDoListID: addTodoListsData.data.item.id };
    } else {

      // Здесь будет упакована ошибка
      return rejectWithValue(addTodoListsData);
    }
  }
);


// ------------- Удаление todolist -----------------------
const deleteTodoLists = createAppAsyncThunk<{
  toDoListID: string
}, string>(
  // 1 - prefix
  `${slice.name}/deleteTodoLists`,
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async (toDoListID, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue } = thunkAPI;

    // Отключаем кнопку во время запроса
    dispatch(toDoListsActions.changeTodolistEntityStatus({ toDoListID, entityStatus: "loading" }));
    // Запрос на удаление todolist
    const deleteTodolistData = await todolistAPI.deleteTodolist(toDoListID);

    // Если успех
    if (deleteTodolistData.resultCode === ResultCode.success) {
      // Включаем кнопку после успешного ответа
      dispatch(toDoListsActions.changeTodolistEntityStatus({ toDoListID, entityStatus: "idle" }));

      // return после ответа от сервера и удалили todolist
      return { toDoListID };
    } else {

      // Включаем кнопку после ответа
      dispatch(toDoListsActions.changeTodolistEntityStatus({ toDoListID, entityStatus: "failed" }));
      // Здесь будет упакована ошибка
      return rejectWithValue(deleteTodolistData);
    }
  }
);


// Создаем toDoListsReducer с помощью slice
export const toDoListsReducer = slice.reducer;

// Action creator достаем с помощью slice
export const toDoListsActions = slice.actions;

// Thunks упаковываем в объект
export const toDoListsThunks = { deleteTodoLists, addTodoLists, updateTodoLists, getTodoLists };

// Упаковали все selectors в один объект
export const toDoListsSelectors = slice.selectors;
