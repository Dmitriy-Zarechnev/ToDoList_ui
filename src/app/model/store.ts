import { thunk } from "redux-thunk";
import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "app/model/reducers";


/* Создали RTK store */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
});

// Hot Replacement
// if (process.env.NODE_ENV === "development" && module.hot) {
//   module.hot.accept("app/model/reducers", () => {
//     store.replaceReducer(require("app/model/reducers").rootReducer);
//   });
// }

// Типизация всего STATE
export type AppRootStateType = ReturnType<typeof store.getState>;


// Типизация dispatch по RTK
export type AppDispatch = typeof store.dispatch;
// Самопальный useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

