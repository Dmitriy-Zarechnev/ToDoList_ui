import { AppRootStateType } from "../store";
import { ToDoListDomainType } from "../reducers/todolists-reducer";

export const toDoListsSelector = (state: AppRootStateType): Array<ToDoListDomainType> => {
  return state.toDoLists;
};
