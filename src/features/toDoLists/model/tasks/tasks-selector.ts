import { AppRootStateType } from "../../../../app/model/store";
import { TasksInitialStateType } from "./tasks-reducer";

export const tasksSelector = (state: AppRootStateType): TasksInitialStateType => {
  return state.tasks;
};
