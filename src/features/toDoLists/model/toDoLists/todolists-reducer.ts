import {AppDispatch, AppRootStateType} from '../../../../app/model/store'
import {ResponseType, todolistAPI, TodolistType} from 'features/toDoLists/api/todolist-api'
import {RequestStatusType} from '../../../../app/model/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ResultCode} from 'utils/api/enums'


// Типизация Filters
export type FilterValuesType = 'all' | 'active' | 'completed';

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
}>()


// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------
export const getTodoListsTC = createAppAsyncThunk<{
    toDoLists: TodolistType[]
}>(
    // 1 - prefix
    'toDoLists/getTodoLists',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async () => {
        // 3 - деструктурируем параметры
        //const {dispatch, rejectWithValue} = thunkAPI

        // Показываем Preloader во время запроса
        //dispatch(setAppStatusAC({status: 'loading'}))

        //try {
        // Запрос на получение todolist с сервера
        const getTodoListsData = await todolistAPI.getTodolists()

        // Убираем Preloader после успешного ответа
        // dispatch(setAppStatusAC({status: 'succeeded'}))

        // Return ответ от сервера
        return {toDoLists: getTodoListsData}
        //} catch (error) {
        // Обработка сетевой ошибки
        // handleServerNetworkError(error, dispatch)
        // Здесь будет упакована ошибка
        // return rejectWithValue(null)
        // }
    }
)


// ------------- Изменение toDoList's title -----------------------
export const updateTodoListsTC = createAppAsyncThunk<{
    toDoListID: string, title: string
}, { toDoListID: string, title: string }>(
    // 1 - prefix
    'toDoLists/updateTodoLists',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async ({toDoListID, title}, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue, getState} = thunkAPI

        // Получили все toDoLists из state
        const allTodoListsFromState = getState().toDoLists

        // Нашли нужный todolist по todolistId
        const toDoList = allTodoListsFromState.find((t) => {
            return t.id === toDoListID
        })

        // Проверка, т.к find может вернуть undefined
        if (toDoList) {
            // Показываем Preloader во время запроса
            //dispatch(setAppStatusAC({status: 'loading'}))

            // try {
            // Запрос на изменение toDoList's title
            const updateTodolistData = await todolistAPI.updateTodolist(toDoListID, title)

            // Если успех
            if (updateTodolistData.resultCode === ResultCode.success) {
                // Убираем Preloader после успешного ответа
                //dispatch(setAppStatusAC({status: 'updated'}))

                // return после ответа от сервера и поменяли title
                return {toDoListID, title}
            } else {
                // Обработка серверной ошибки
                //handleServerAppError(updateTodolistData, dispatch)
                // Здесь будет упакована ошибка
                return rejectWithValue(updateTodolistData)
            }
            // } catch (error) {
            // Обработка сетевой ошибки
            // handleServerNetworkError(error, dispatch)
            // Здесь будет упакована ошибка
            // return rejectWithValue(null)
            //}
        }
        // Здесь будет упакована ошибка
        return rejectWithValue(null)
    }
)


// ------------- Добавление нового todolist -----------------------
export const addTodoListsTC = createAppAsyncThunk<{
    title: string, toDoListID: string
}, string>(
    // 1 - prefix
    'toDoLists/addTodoLists',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async (title, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue} = thunkAPI

        // Показываем Preloader во время запроса
        //dispatch(setAppStatusAC({status: 'loading'}))

        //try {
        // Запрос на добавление todolist
        const addTodoListsData = await todolistAPI.createTodolist(title)

        // Если успех
        if (addTodoListsData.resultCode === ResultCode.success) {
            // Убираем Preloader после успешного ответа
            // dispatch(setAppStatusAC({status: 'updated'}))

            // return ответ от сервера
            return {title, toDoListID: addTodoListsData.data.item.id}
        } else {

            // Обработка серверной ошибки
            // handleServerAppError(addTodoListsData, dispatch)
            // Здесь будет упакована ошибка
            debugger
            return rejectWithValue(addTodoListsData)

        }
        // } catch (error) {
        // Обработка сетевой ошибки
        // handleServerNetworkError(error, dispatch)
        // Здесь будет упакована ошибка
        //   return rejectWithValue(null)
        // }
    }
)


// ------------- Удаление todolist -----------------------
export const deleteTodoListsTC = createAppAsyncThunk<{
    toDoListID: string
}, string>(
    // 1 - prefix
    'toDoLists/deleteTodoLists',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async (toDoListID, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue} = thunkAPI
        // Показываем Preloader во время запроса
        // dispatch(setAppStatusAC({status: 'loading'}))

        // Отключаем кнопку во время запроса
        dispatch(changeTodolistEntityStatusAC({toDoListID, entityStatus: 'loading'}))

        // try {
        // Запрос на удаление todolist
        const deleteTodolistData = await todolistAPI.deleteTodolist(toDoListID)

        // Если успех
        if (deleteTodolistData.resultCode === ResultCode.success) {
            // Включаем кнопку после успешного ответа
            dispatch(changeTodolistEntityStatusAC({toDoListID, entityStatus: 'idle'}))
            // Убираем Preloader после успешного ответа
            //dispatch(setAppStatusAC({status: 'updated'}))

            // return после ответа от сервера и удалили todolist
            return {toDoListID}
        } else {
            // Обработка серверной ошибки
            //  handleServerAppError(deleteTodolistData, dispatch)
            // Здесь будет упакована ошибка
            return rejectWithValue(deleteTodolistData)
        }
        //} catch (error) {
        // Обработка сетевой ошибки
        //  handleServerNetworkError(error, dispatch)
        // Здесь будет упакована ошибка
        //  return rejectWithValue(null)
        //}
    }
)

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
    // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
    name: 'toDoLists',
    initialState: [] as ToDoListDomainType[],
    // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
    reducers: {
        changeTodolistFilterAC: (state,
                                 action: PayloadAction<{ toDoListID: string, filter: FilterValuesType }>) => {
            const toDo =
                state.find(el => el.id === action.payload.toDoListID)

            if (toDo) {
                toDo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC: (state,
                                       action: PayloadAction<{
                                           toDoListID: string,
                                           entityStatus: RequestStatusType
                                       }>) => {
            const toDo =
                state.find(el => el.id === action.payload.toDoListID)

            if (toDo) {
                toDo.entityStatus = action.payload.entityStatus
            }
        },
        clearToDoDataAC: (state) => {
            state.splice(0, state.length)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getTodoListsTC.fulfilled,
                (state, action) => {
                    return action.payload.toDoLists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
                })
            .addCase(updateTodoListsTC.fulfilled,
                (state, action) => {
                    const toDo =
                        state.find(el => el.id === action.payload.toDoListID)

                    if (toDo) {
                        toDo.title = action.payload.title
                    }
                })
            .addCase(addTodoListsTC.fulfilled,
                (state, action) => {
                    state.unshift({
                        id: action.payload.toDoListID,
                        title: action.payload.title,
                        filter: 'all',
                        addedDate: '',
                        order: 0,
                        entityStatus: 'idle'
                    })
                })
            .addCase(deleteTodoListsTC.fulfilled,
                (state, action) => {
                    const index = state.findIndex(el => el.id === action.payload.toDoListID)
                    if (index > -1) {
                        state.splice(index, 1)
                    }
                })
    }
})


// Создаем toDoListsReducer с помощью slice
export const toDoListsReducer = slice.reducer
// Action creators достаем с помощью slice
export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    clearToDoDataAC
} = slice.actions

// Action creator достаем с помощью slice
export const toDoListsActions = slice.actions

// Thunks упаковываем в объект
export const toDoListsThunks = {deleteTodoListsTC, addTodoListsTC, updateTodoListsTC, getTodoListsTC}

/*
// Типизация Actions всего todolistsReducer
export type ToDoListActionsTypes =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | SetTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | ClearToDoDataActionType;

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type SetTodolistActionType = ReturnType<typeof setToDoListsAC>;
export type ClearToDoDataActionType = ReturnType<typeof clearToDoDataAC>;

// Константы для работы с action в todolistsReducer
export const REMOVE_TODOLIST = "TODOLISTS/REMOVE-TODOLIST";
export const ADD_TODOLIST = "TODOLISTS/ADD-TODOLIST";
const CHANGE_TODOLIST_TITLE = "TODOLISTS/CHANGE-TODOLIST-TITLE";
const CHANGE_TODOLIST_FILTER = "TODOLISTS/CHANGE-TODOLIST-FILTER";
export const SET_TODOLISTS = "TODOLISTS/SET-TODOLISTS";
const CHANGE_TODOLIST_ENTITY_STATUS = "TODOLISTS/CHANGE-TODOLIST-ENTITY-STATUS";
export const CLEAR_TO_DO_DATA = "TODOLISTS/CLEAR-TO-DO-DATA";

// Типизация Filters
export type FilterValuesType = "all" | "active" | "completed";

// Типизация Todolists объединенный с filter
export type ToDoListDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// *********** Первоначальный state для todolistsReducer ****************
const initialState: ToDoListDomainType[] = [];

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const todolistsReducer = (state = initialState, action: ToDoListActionsTypes): ToDoListDomainType[] => {
  switch (action.type) {
    case REMOVE_TODOLIST:
      return state.filter((el) => el.id !== action.payload.toDoListID);
    case ADD_TODOLIST:
      return [
        {
          id: action.payload.todolistId,
          title: action.payload.title,
          filter: "all",
          addedDate: "",
          order: 0,
          entityStatus: "idle"
        },
        ...state
      ];
    case CHANGE_TODOLIST_TITLE:
      return state.map((el) => (el.id === action.payload.toDoListID ? { ...el, title: action.payload.title } : el));
    case CHANGE_TODOLIST_FILTER:
      return state.map((el) => (el.id === action.payload.toDoListID ? { ...el, filter: action.payload.filter } : el));
    case SET_TODOLISTS:
      return action.payload.toDoLists.map((el) => ({ ...el, filter: "all", entityStatus: "idle" }));
    case CHANGE_TODOLIST_ENTITY_STATUS:
      return state.map((el) => (el.id === action.payload.id ? { ...el, entityStatus: action.payload.status } : el));
    case CLEAR_TO_DO_DATA:
      return [];
    default:
      return state;
  }
};

// *********** Action creators - создают объект action ****************
export const removeTodolistAC = (toDoListID: string) => {
  return { type: REMOVE_TODOLIST, payload: { toDoListID } } as const;
};
export const addTodolistAC = (title: string, todolistId: string) => {
  return { type: ADD_TODOLIST, payload: { title, todolistId } } as const;
};
export const changeTodolistTitleAC = (toDoListID: string, title: string) => {
  return { type: CHANGE_TODOLIST_TITLE, payload: { toDoListID, title } } as const;
};
export const changeTodolistFilterAC = (toDoListID: string, filter: FilterValuesType) => {
  return { type: CHANGE_TODOLIST_FILTER, payload: { toDoListID, filter } } as const;
};
export const setToDoListsAC = (toDoLists: Array<TodolistType>) => {
  return { type: SET_TODOLISTS, payload: { toDoLists } } as const;
};
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
  return { type: CHANGE_TODOLIST_ENTITY_STATUS, payload: { id, status } } as const;
};
export const clearToDoDataAC = () => {
  return { type: CLEAR_TO_DO_DATA } as const;
};

 */
/*
// *********** Thunk - необходимые для общения с DAL ****************
// ------------- Получение todolist с сервера -----------------------
export const getTodoListsTC = () => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));

  try {
    // Запрос на получение todolist с сервера
    const getTodoListsData = await todolistAPI.getTodolists();

    // Задиспатчили ответ от сервера
    dispatch(setToDoListsAC({ toDoLists: getTodoListsData }));

    // Задиспатчили tasks с сервера для каждого todolist
    getTodoListsData.forEach((el) => {
      dispatch(getTasksTC(el.id));
    });

    // Убираем Preloader после успешного ответа
    dispatch(setAppStatusAC({ status: "succeeded" }));
  } catch (error: any) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

 */
/*
// ------------- Изменение todolist's title -----------------------
export const updateTodoListsTC =
    (todolistId: string, title: string) => async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
        // Получили все todolists из state
        const allTodoListsFromState = getState().toDoLists

        // Нашли нужный todolist по todolistId
        const todoList = allTodoListsFromState.find((t) => {
            return t.id === todolistId
        })

        // Проверка, т.к find может вернуть undefined
        if (todoList) {
            // Показываем Preloader во время запроса
            dispatch(setAppStatusAC({status: 'loading'}))

            try {
                // Запрос на изменение todolist's title
                const updateTodolistData = await todolistAPI.updateTodolist(todolistId, title)

                // Если успех
                if (updateTodolistData.resultCode === 0) {
                    // Задиспатчили после ответа от сервера и поменяли title
                    dispatch(changeTodolistTitleAC({toDoListID: todolistId, title}))

                    // Убираем Preloader после успешного ответа
                    dispatch(setAppStatusAC({status: 'updated'}))
                } else {
                    // Обработка серверной ошибки
                    handleServerNetworkError(updateTodolistData, dispatch)
                }
            } catch (error: any) {
                // Обработка сетевой ошибки
                handleServerNetworkError(error, dispatch)
            }
        }
    }

 */
/*
// ------------- Добавление нового todolist -----------------------
export const addTodoListsTC = (title: string) => async (dispatch: AppDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC({status: 'loading'}))

    try {
        // Запрос на добавление todolist
        const addTodoListsData = await todolistAPI.createTodolist(title)

        // Если успех
        if (addTodoListsData.resultCode === 0) {
            // Задиспатчили ответ от сервера
            dispatch(addTodolistAC({title, toDoListID: addTodoListsData.data.item.id}))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({status: 'updated'}))
        } else {
            // Обработка серверной ошибки
            handleServerNetworkError(addTodoListsData, dispatch)
        }
    } catch (error: any) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

 */
/*
// ------------- Удаление todolist -----------------------
export const deleteTodoListsTC = (toDoListID: string) => async (dispatch: AppDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC({status: 'loading'}))
    // Отключаем кнопку во время запроса
    dispatch(changeTodolistEntityStatusAC({toDoListID, entityStatus: 'loading'}))

    try {
        // Запрос на удаление todolist
        const deleteTodolistData = await todolistAPI.deleteTodolist(toDoListID)

        // Если успех
        if (deleteTodolistData.resultCode === 0) {
            // Задиспатчили после ответа от сервера и удалили todolist
            dispatch(removeTodolistAC({toDoListID}))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({status: 'updated'}))
        } else {
            // Обработка серверной ошибки
            handleServerNetworkError(deleteTodolistData, dispatch)
        }
    } catch (error: any) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

 */
