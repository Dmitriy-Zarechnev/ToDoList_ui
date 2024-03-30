import { combineReducers } from "redux";
import { TasksActionsType, tasksReducer } from "./reducers/tasks-reducer";
import { ToDoListActionsTypes, todolistsReducer } from "./reducers/todolists-reducer";
import { thunk, ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";
import { AppActionsTypes, appReducer } from "./reducers/app-reducer";
import { authReducer } from "./reducers/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

/* Создали RTK store */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

// Типизация rootReducer
export type RootReducerType = typeof rootReducer;

// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof store.getState>;

// Типизация всех AC для типизации thunk
type CommonActionsTypes = ToDoListActionsTypes | TasksActionsType | AppActionsTypes;

// Типизация для thunk, позволяет диспатчить thunk и action
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, CommonActionsTypes>;

// Типизация dispatch по RTK
export type AppDispatch = typeof store.dispatch;
// Самопальный useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
