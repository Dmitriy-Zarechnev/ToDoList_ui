import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootStateType } from "app/model/store";
import { ResponseType } from "features/toDoLists/api/todolist-api";
import { setAppStatusAC } from "app/model/app-reducer";
import { handleServerNetworkError } from "utils/errors/handle-server-network-error";

/*
Функция thunkTryCatch возвращает результат выполнения logic.
Если во время выполнения logic произошла ошибка, мы обрабатываем ее в блоке catch.
Затем мы заканчиваем выполнение thunkTryCatch, устанавливая статус приложения в первоначальное состояние idle.
Это позволяет нам избежать дублирования кода и повторного использования try-catch блоков в каждом из thunk.
*/

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | ResponseType>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  // Показываем Preloader во время запроса
  dispatch(setAppStatusAC({ status: "loading" }));

  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(setAppStatusAC({ status: "idle" }));
  }
};