import { Dispatch } from "redux";
import { ResponseType } from "api/todolist-api";
import { setAppErrorAC, setAppStatusAC } from "state/reducers/app-reducer";
import { AppDispatch } from "state/store";
import axios from "axios";


export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occurred";

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err);
  }
  // Задиспатчили ошибку
  dispatch(setAppErrorAC({ error: errorMessage }));
  // Изменили статус
  dispatch(setAppStatusAC({ status: "failed" }));
};


// // Типизация для dispatch
// type ErrorUtilsDispatchType = Dispatch;
/*
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

 */
