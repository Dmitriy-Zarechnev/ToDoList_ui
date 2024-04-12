import { AppRootStateType } from "app/model/store";

export const isLoggedInSelector = (state: AppRootStateType): boolean => {
  return state.auth.isLoggedIn;
};
