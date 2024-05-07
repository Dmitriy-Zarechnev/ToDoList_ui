import { combineReducers } from "redux";
import { tasksReducer } from "features/toDoLists/model/tasks/tasks-reducer";
import { toDoListsReducer } from "features/toDoLists/model/toDoLists/todolists-reducer";
import { appReducer } from "app/model/app-reducer";
import { authReducer } from "features/auth/model/auth-reducer";

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  toDoLists: toDoListsReducer,
  app: appReducer,
  auth: authReducer
});