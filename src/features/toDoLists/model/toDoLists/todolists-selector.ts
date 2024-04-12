import { AppRootStateType } from "app/model/store";
import { ToDoListDomainType } from "./todolists-reducer";

export const toDoListsSelector = (state: AppRootStateType): Array<ToDoListDomainType> => {
  return state.toDoLists;
};
