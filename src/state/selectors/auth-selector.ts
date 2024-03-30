import { AppRootStateType } from "../store";

export const isLoggedInSelector = (state: AppRootStateType): boolean => {
  return state.auth.isLoggedIn;
};
