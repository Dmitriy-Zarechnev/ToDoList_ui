import { setAppInitializedAC, setAppStatusAC } from "./app-reducer";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { authAPI, LoginParamsType } from "api/auth-api";
import { clearToDoDataAC, createAppAsyncThunk } from "./todolists-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { ResultCode } from "api/enums";
import { handleServerAppError } from "utils/handle-server-app-error";
import { thunkTryCatch } from "utils/thunk-try-catch";


// *********** Thunk - необходимы для общения с DAL ****************
// ------------- LogIn на сервере -----------------------
export const logInTC = createAppAsyncThunk<{
  isLoggedIn: boolean
}, LoginParamsType>(
  // 1 - prefix
  "auth/logIn",
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async (data, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue } = thunkAPI;
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC({ status: "loading" }));

    try {
      // Запрос на logIn
      const logInData = await authAPI.logIn(data);

      // Если успех
      if (logInData.resultCode === ResultCode.success) {
        // Убираем Preloader после успешного ответа
        dispatch(setAppStatusAC({ status: "idle" }));

        // Return после ответа от сервера true
        return { isLoggedIn: true };
      } else {
        // ❗ Если у нас fieldsErrors есть значит мы будем отображать эти ошибки
        // в конкретном поле в компоненте
        // ❗ Если у нас fieldsErrors нет значит отобразим ошибку глобально
        const isShowAppError = !logInData.fieldsErrors.length;

        // Обработка серверной ошибки
        handleServerAppError(logInData, dispatch, isShowAppError);
        // Здесь будет упакована ошибка
        return rejectWithValue(logInData);
      }

    } catch (error) {
      // Обработка сетевой ошибки
      handleServerNetworkError(error, dispatch);
      // Здесь будет упакована ошибка
      return rejectWithValue(null);
    }
  }
);

// ------------- Проверка при первом входе -----------------------
export const initializeMeTC = createAppAsyncThunk<{
  isLoggedIn: boolean
}>(
  // 1 - prefix
  "auth/initializeMe",
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async (_, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      // Запрос на проверку
      const meData = await authAPI.me();

      // Если успех
      if (meData.resultCode === ResultCode.success) {
        // Убираем Preloader после успешного ответа
        dispatch(setAppStatusAC({ status: "idle" }));

        // Return после ответа от сервера true
        return { isLoggedIn: true };
      } else {
        // Обработка серверной ошибки
        handleServerAppError(meData, dispatch);
        // Здесь будет упакована ошибка
        return rejectWithValue(null);
      }
    }).finally(() => {
      // Инициализировали приложение после ответа
      dispatch(setAppInitializedAC({ isInitialized: true }));
    });

    // try {
    //   // Запрос на проверку
    //   const meData = await authAPI.me();
    //
    //   // Если успех
    //   if (meData.resultCode === ResultCode.success) {
    //     // Убираем Preloader после успешного ответа
    //     dispatch(setAppStatusAC({ status: "idle" }));
    //
    //     // Return после ответа от сервера true
    //     return { isLoggedIn: true };
    //   } else {
    //     // Обработка серверной ошибки
    //     handleServerAppError(meData, dispatch);
    //     // Здесь будет упакована ошибка
    //     return rejectWithValue(null);
    //   }
    //
    // } catch (error) {
    //
    //   // Обработка сетевой ошибки
    //   handleServerNetworkError(error, dispatch);
    //   // Здесь будет упакована ошибка
    //   return rejectWithValue(null);
    // } finally {
    //
    //   // Инициализировали приложение после ответа
    //   dispatch(setAppInitializedAC({ isInitialized: true }));
    // }
  }
);

// ------------- LogOut с сервера -----------------------
export const logOutTC = createAppAsyncThunk<{
  isLoggedIn: boolean
}>(
  // 1 - prefix
  "auth/logOut",
  // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
  async (_, thunkAPI) => {
    // 3 - деструктурируем параметры
    const { dispatch, rejectWithValue } = thunkAPI;
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC({ status: "loading" }));

    try {
      // Запрос на LogOut
      const logOutData = await authAPI.logOut();

      // Если успех
      if (logOutData.resultCode === ResultCode.success) {
        // Удалили все данные из store после вылогинизации
        dispatch(clearToDoDataAC());
        // Убираем Preloader после успешного ответа
        dispatch(setAppStatusAC({ status: "idle" }));

        // Return после ответа от сервера false
        return { isLoggedIn: false };
      } else {
        // Обработка серверной ошибки
        handleServerAppError(logOutData, dispatch);
        // Здесь будет упакована ошибка
        return rejectWithValue(null);
      }

    } catch (error) {
      // Обработка сетевой ошибки
      handleServerNetworkError(error, dispatch);
      // Здесь будет упакована ошибка
      return rejectWithValue(null);
    }
  }
);

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
  // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
  name: "auth",
  initialState: {
    isLoggedIn: false as boolean
  },
  // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
  reducers: {
    // setIsLoggedInAC: (state,
    //                   action: PayloadAction<{ isLoggedIn: boolean }>) => {
    //     state.isLoggedIn = action.payload.isLoggedIn
    // }
  },
  extraReducers: builder => {
    builder
      .addCase(logInTC.fulfilled,
        (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        })
      .addCase(initializeMeTC.fulfilled,
        (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        })
      .addCase(logOutTC.fulfilled,
        (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        });
  }
});

// Создаем authReducer с помощью slice
export const authReducer = slice.reducer;

// Action creator достаем с помощью slice
//export const {setIsLoggedInAC} = slice.actions
// Типизация AuthInitialStateType для тестов
export type AuthInitialStateType = ReturnType<typeof slice.getInitialState>

// Thunks упаковываем в объект
export const authThunks = {logOutTC,logInTC, initializeMeTC}
/*
// Типизация Actions всего authReducer
export type AuthActionsTypes = ReturnType<typeof setIsLoggedInAC>;

// Типизация initialState для authReducer
export type AuthInitialStateType = typeof initialState;

// Константы для работы с action в authReducer
const SET_IS_LOGGED_IN = "AUTH/SET-IS-LOGGED-IN";

// *********** Первоначальный state для authReducer ****************
const initialState = {
  isLoggedIn: false as boolean,
};

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const authReducer = (
  state: AuthInitialStateType = initialState,
  action: AuthActionsTypes,
): AuthInitialStateType => {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};

// *********** Action creators - создают объект action ****************
export const setIsLoggedInAC = (value: boolean) => {
  return { type: SET_IS_LOGGED_IN, value } as const;
};

 */
/*
// *********** Thunk - необходимы для общения с DAL ****************
// ------------- Логинизация на сервере -----------------------
export const logInTC = (data: LoginParamsType) => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));

  try {
    // Запрос на логинизацию
    const logInData = await authAPI.logIn(data);

    // Если успех
    if (logInData.resultCode === 0) {
      // Задиспатчили после ответа от сервера true
      dispatch(setIsLoggedInAC({ isLoggedIn: true }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC({ status: "idle" }));
    } else {
      // Обработка серверной ошибки
      handleServerNetworkError(logInData, dispatch);
    }
  } catch (error) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

 */
/*
// ------------- Проверка при первом входе -----------------------
export const initializeMeTC = () => async (dispatch: AppDispatch) => {
    try {
        // Запрос на проверку
        const meData = await authAPI.me()

        // Если успех
        if (meData.resultCode === 0) {
            // Задиспатчили после ответа от сервера true
            dispatch(setIsLoggedInAC({isLoggedIn: true}))

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({status: 'idle'}))
        } else {
            // Обработка серверной ошибки
            handleServerNetworkError(meData, dispatch)
        }
        // Инициализировали приложенеи после ответа
        dispatch(setAppInitializedAC({isInitialized: true}))
    } catch (error) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

 */
/*
// ------------- Вылогинизация на сервере -----------------------
export const logOutTC = () => async (dispatch: AppDispatch) => {
    // Показываем Preloader во время запроса
    dispatch(setAppStatusAC({status: 'loading'}))

    try {
        // Запрос на вылогинизацию
        const logOutData = await authAPI.logOut()

        // Если успех
        if (logOutData.resultCode === 0) {
            // Задиспатчили после ответа от сервера false
            dispatch(setIsLoggedInAC({isLoggedIn: false}))

            // Удалили все данные из store после вылогинизации
            dispatch(clearToDoDataAC())

            // Убираем Preloader после успешного ответа
            dispatch(setAppStatusAC({status: 'idle'}))
        } else {
            // Обработка серверной ошибки
            handleServerNetworkError(logOutData, dispatch)
        }
    } catch (error) {
        // Обработка сетевой ошибки
        handleServerNetworkError(error, dispatch)
    }
}

 */
