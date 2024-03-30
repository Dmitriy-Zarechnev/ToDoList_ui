import { Dispatch } from "redux";
import { ResponseType } from "api/todolist-api";
import { setAppErrorAC, setAppStatusAC } from "state/reducers/app-reducer";

// // Типизация для dispatch
// type ErrorUtilsDispatchType = Dispatch;

// generic function для серверной ошибки
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  // Проверили существование ошибки
  data.messages.length
    ? // Задиспатчили ошибку с сервера
    dispatch(setAppErrorAC({ error: data.messages[0] }))
    : // Задиспатчили ошибку свою
    dispatch(setAppErrorAC({ error: "Some error occurred🤬" }));

  // Изменили статус
  dispatch(setAppStatusAC({ status: "failed" }));
};

// function для сетевой ошибки
export const handleServerNetworkError = (error: any, dispatch: Dispatch) => {
  // Задиспатчили ошибку сети и поменяли статус
  dispatch(setAppErrorAC(error.toString()));
  dispatch(setAppStatusAC({ status: "failed" }));
};
