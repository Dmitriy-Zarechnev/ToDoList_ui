import { setAppErrorAC, setAppStatusAC } from "app/model/app-reducer";
import { Dispatch } from "redux";
import { ResponseType } from "features/toDoLists/api/todolist-api";

/**
 * Данная функция обрабатывает ошибки, которые могут возникнуть при взаимодействии с сервером.
 * @param data  - ответ от сервера в формате ResponseType<T>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param showError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
 */


// generic function для серверной ошибки
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    // Проверили существование ошибки
    data.messages.length
      ? // Dispatch ошибку с сервера
      dispatch(setAppErrorAC({ error: data.messages[0] }))
      : // Dispatch ошибку свою
      dispatch(setAppErrorAC({ error: "Some error occurred🤬" }));
  }
  // Изменили статус
  dispatch(setAppStatusAC({ status: "failed" }));
};

