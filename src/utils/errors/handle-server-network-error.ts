import {AppDispatch} from '../../app/model/store'
import axios from 'axios'
import {setAppErrorAC, setAppStatusAC} from '../../app/model/app-reducer'

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
    // Dispatch ошибку
    dispatch(setAppErrorAC({ error: errorMessage }));
    // Изменили статус
    dispatch(setAppStatusAC({ status: "failed" }));
};