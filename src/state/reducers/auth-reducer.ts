import { AppDispatch } from "../store";
import { setAppInitializedAC, setAppStatusAC } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { authAPI, LoginParamsType } from "api/auth-api";
import { clearToDoDataAC } from "./todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
  // важно чтобы не дублировалось, будет в качетве приставки согласно соглашению redux ducks
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  // подредьюсеры, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

// Создаем reducer с помощью slice
export const authReducer = slice.reducer;
// Action creator также достаем с помощью slice
export const { setIsLoggedInAC } = slice.actions;
// либо вот так. ❗Делаем так, в дальнейшем пригодиться
export const authActions = slice.actions;

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

// *********** Thunk - необходимы для общения с DAL ****************
// ------------- Логинизация на сервере -----------------------
export const logInTC = (data: LoginParamsType) => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC("loading"));

  try {
    // Запрос на логинизацию
    const logInData = await authAPI.logIn(data);

    // Если успех
    if (logInData.resultCode === 0) {
      // Задиспатчили после ответа от сервера true
      dispatch(setIsLoggedInAC({ isLoggedIn: true }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC("idle"));
    } else {
      // Обработка серверной ошибки
      handleServerAppError(logInData, dispatch);
    }
  } catch (error) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

// ------------- Проверка при первом входе -----------------------
export const initializeMeTC = () => async (dispatch: AppDispatch) => {
  try {
    // Запрос на проверку
    const meData = await authAPI.me();

    // Если успех
    if (meData.resultCode === 0) {
      // Задиспатчили после ответа от сервера true
      dispatch(setIsLoggedInAC({ isLoggedIn: true }));

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC("idle"));
    } else {
      // Обработка серверной ошибки
      handleServerAppError(meData, dispatch);
    }
    // Инициализировали приложенеи после ответа
    dispatch(setAppInitializedAC(true));
  } catch (error) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};

// ------------- Вылогинизация на сервере -----------------------
export const logOutTC = () => async (dispatch: AppDispatch) => {
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC("loading"));

  try {
    // Запрос на вылогинизацию
    const logOutData = await authAPI.logOut();

    // Если успех
    if (logOutData.resultCode === 0) {
      // Задиспатчили после ответа от сервера false
      dispatch(setIsLoggedInAC({ isLoggedIn: false }));

      // Удалили все данные из store после вылогинизации
      dispatch(clearToDoDataAC());

      // Убираем Preloader после успешного ответа
      dispatch(setAppStatusAC("idle"));
    } else {
      // Обработка серверной ошибки
      handleServerAppError(logOutData, dispatch);
    }
  } catch (error) {
    // Обработка сетевой ошибки
    handleServerNetworkError(error, dispatch);
  }
};
