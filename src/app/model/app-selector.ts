import { AppRootStateType } from "./store";
import { RequestStatusType } from "./app-reducer";

export const appStatusSelector = (state: AppRootStateType): RequestStatusType => {
  return state.app.status;
};

export const appErrorSelector = (state: AppRootStateType): string | null => {
  return state.app.error;
};

export const appIsInitializedSelector = (state: AppRootStateType): boolean => {
  return state.app.isInitialized;
};
