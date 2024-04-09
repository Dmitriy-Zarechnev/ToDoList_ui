import {createSlice, isFulfilled, isPending, isRejected, PayloadAction} from '@reduxjs/toolkit'
import {toDoListsThunks} from '../../features/toDoLists/model/toDoLists/todolists-reducer'


// Типы статусов для работы в приложении
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' | 'updated';

// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
    // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as string | null,
        isInitialized: false as boolean
    },
    // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
    reducers: {
        setAppStatusAC: (state,
                         action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state,
                        action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppInitializedAC: (state,
                              action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher(isPending, (state) => {
                    state.status = 'loading'
                }
            )
            .addMatcher(isFulfilled, (state) => {
                    state.status = 'updated'
                }
            )
            .addMatcher(isRejected, (state, action: any) => {
                    state.status = 'failed'
                    if (action.payload) {
                        // Не показываем ошибку глобально, а только локально в AddItemForm 40 строка
                        if (action.type === toDoListsThunks.addTodoListsTC.rejected.type) return

                        // Показываем ошибку глобально сервера
                        state.error = action.payload.messages[0]
                    } else {
                        // Показываем ошибку сети
                        state.error = action.error.message
                            ? action.error.message
                            : 'Some error occurred'
                    }
                }
            )
        // --------------   -----------------------  ------------
        // .addMatcher(isPending(toDoListsThunks.getTodoListsTC),
        //     (state) => {
        //         state.status = 'loading'
        //     }
        // )
        // ------------   -------------------  --------------
        //     .addMatcher((action) => {
        //         console.log('addMatcher matcher', action.type)
        //         return action.type.endsWith('/pending')
        //     }, (state, action) => {
        //         state.status = 'loading'
        //         console.log('✅ addMatcher reducer')
        //     }
        // )
    }
})

// Создаем appReducer с помощью slice
export const appReducer = slice.reducer

export const appActions = slice.actions

// Action creators достаем с помощью slice
export const {
    setAppStatusAC,
    setAppErrorAC,
    setAppInitializedAC
} = slice.actions
// Типизация AppInitialStateType для тестов
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

/*
// Типизация Actions всего appReducer
export type AppActionsTypes =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setAppInitializedAC>;

// Типы статусов для работы в приложении
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed" | "updated";

// Типизация initialState для appReducer
export type AppInitialStateType = typeof initialState;

// Константы для работы с action в appReducer
const SET_APP_STATUS = "APP/SET-APP-STATUS";
const SET_APP_ERROR = "APP/SET-APP-ERROR";
const SET_APP_INITIALIZED = "APP/SET-APP-INITIALIZED";

// *********** Первоначальный state для appReducer ****************
const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false as boolean
};

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
export const appReducer = (state: AppInitialStateType = initialState, action: AppActionsTypes): AppInitialStateType => {
  switch (action.type) {
    case SET_APP_STATUS:
      return { ...state, status: action.status };

    case SET_APP_ERROR:
      return { ...state, error: action.error };

    case SET_APP_INITIALIZED:
      return { ...state, isInitialized: action.isInitialized };

    default:
      return state;
  }
};

// *********** Action creators - создают объект action ****************
export const setAppStatusAC = (status: RequestStatusType) => {
  return { type: SET_APP_STATUS, status } as const;
};
export const setAppErrorAC = (error: string | null) => {
  return { type: SET_APP_ERROR, error } as const;
};
export const setAppInitializedAC = (isInitialized: boolean) => {
  return { type: SET_APP_INITIALIZED, isInitialized } as const;
};
 */

// *********** Thunk - необходимы для общения с DAL ****************
