import { AppRootStateType } from "app/model/store";

export const isLoggedInSelector = (state: AppRootStateType): boolean => {
  return state.auth.isLoggedIn;
};

export const captchaUrlSelector = (state: AppRootStateType): string => {
  return state.auth.captchaUrl;
};