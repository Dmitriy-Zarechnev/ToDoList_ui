import { tasksReducer } from "features/toDoLists/model/tasks/tasks-reducer";
import { toDoListsReducer } from "features/toDoLists/model/toDoLists/todolists-reducer";
import { thunk } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/auth/model/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";


/* Создали RTK store */
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    toDoLists: toDoListsReducer,
    app: appReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
});


// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof store.getState>;


// Типизация dispatch по RTK
export type AppDispatch = typeof store.dispatch;
// Самопальный useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

