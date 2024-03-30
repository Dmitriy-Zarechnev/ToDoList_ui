import { Dispatch } from "redux";
import { ResponseType } from "../api/todolist-api";
import { AppActionsTypes, setAppErrorAC, setAppStatusAC } from "../state/reducers/app-reducer";

// Типизация для dispatch
type ErrorUtilsDispatchType = Dispatch<AppActionsTypes>;

// generic function для серверной ошибки
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
  // Проверили существование ошибки
  data.messages.length
    ? // Задиспатчили ошибку с сервера
      dispatch(setAppErrorAC(data.messages[0]))
    : // Задиспатчили ошибку свою
      dispatch(setAppErrorAC("Some error occurred🤬"));

  // Изменили статус
  dispatch(setAppStatusAC("failed"));
};

// function для сетевой ошибки
export const handleServerNetworkError = (error: any, dispatch: ErrorUtilsDispatchType) => {
  // Задиспатчили ошибку сети и поменяли статус
  dispatch(setAppErrorAC(error.toString()));
  dispatch(setAppStatusAC("failed"));
};
