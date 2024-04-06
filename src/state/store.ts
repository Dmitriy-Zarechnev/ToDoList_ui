import { tasksReducer } from "./reducers/tasks-reducer";
import { toDoListsReducer } from "./reducers/todolists-reducer";
import { thunk } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "./reducers/app-reducer";
import { authReducer } from "./reducers/auth-reducer";
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

// // Типизация rootReducer
// export type RootReducerType = typeof rootReducer;


// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof store.getState>;


// Типизация dispatch по RTK
export type AppDispatch = typeof store.dispatch;
// Самопальный useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

