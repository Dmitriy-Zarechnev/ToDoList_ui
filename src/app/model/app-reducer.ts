import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { authThunks } from "features/auth/model/auth-reducer";


// Типы статусов для работы в приложении
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed" | "updated";


// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
  // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean
  },
  // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
  reducers: {
    setAppStatus: (state,
                   action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state,
                  action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppInitialized: (state,
                        action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(isPending, (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(isFulfilled, (state, action) => {
          if (action.type === authThunks.logOut.fulfilled.type) {
            // Убрал оповещение при выходе из приложения
            state.status = "idle";
          } else if (action.type === authThunks.getCaptcha.fulfilled.type) {
            // Убрал оповещение при появлении captcha
            state.status = "idle";
          } else if (action.type === authThunks.logIn.fulfilled.type) {
            // Убрал оповещение при входе
            state.status = "idle";
          } else {
            state.status = "updated";
          }
        }
      )
      .addMatcher(isRejected, (state, action: any) => {
          state.status = "failed";
          if (action.payload) {
            // Не показываем ошибку глобально, а только локально в AddItemForm 40 строка
            //if (action.type === toDoListsThunks.addTodoLists.rejected.type) return
            //if (action.type === tasksThunks.addTaskTC.rejected.type) return

            // Показываем ошибку сервера глобально
            state.error = action.payload.messages[0];
          } else {
            // Показываем ошибку сети глобально
            state.error = action.error.message
              ? action.error.message
              : "Some error occurred";
          }
        }
      );
  },
  selectors: {
    selectAppStatus: (sliceState) => sliceState.status,
    selectAppError: (sliceState) => sliceState.error,
    selectAppIsInitialized: (sliceState) => sliceState.isInitialized
  }
});

// Создаем appReducer с помощью slice
export const appReducer = slice.reducer;

// Упаковали все actions в один объект
export const appActions = slice.actions;

// Упаковали все selectors в один объект
export const appSelectors = slice.selectors;

// Типизация AppInitialStateType для тестов
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>
