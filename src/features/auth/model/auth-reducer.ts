import {authAPI, LoginParamsType} from 'features/auth/api/auth-api'
import {clearToDoDataAC, createAppAsyncThunk} from '../../toDoLists/model/toDoLists/todolists-reducer'
import {createSlice, isFulfilled, PayloadAction} from '@reduxjs/toolkit'
import {ResultCode} from 'utils/api/enums'
import {appActions} from '../../../app/model/app-reducer'


// *********** Thunk - необходимы для общения с DAL ****************
// ------------- LogIn на сервере -----------------------
export const logIn = createAppAsyncThunk<{
    isLoggedIn: boolean
}, LoginParamsType>(
    // 1 - prefix
    'auth/logIn',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async (data, {rejectWithValue}) => {
        // Запрос на logIn
        const logInData = await authAPI.logIn(data)

        // Если успех
        if (logInData.resultCode === ResultCode.success) {

            // Return после ответа от сервера true
            return {isLoggedIn: true}
        } else {
            // Здесь будет упакована ошибка
            return rejectWithValue(logInData)
        }
    }
)

// ------------- Проверка при первом входе -----------------------
export const initializeMe = createAppAsyncThunk<{
    isLoggedIn: boolean
}>(
    // 1 - prefix
    'auth/initializeMe',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async (_, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue} = thunkAPI

        // Запрос на проверку
        const meData = await authAPI.me()
        // Инициализировали приложение после ответа
        dispatch(appActions.setAppInitialized({isInitialized: true}))

        // Если успех
        if (meData.resultCode === ResultCode.success) {

            // Return после ответа от сервера true
            return {isLoggedIn: true}
        } else {
            // Здесь будет упакована ошибка
            return rejectWithValue(meData)
        }
    }
)

// ------------- LogOut с сервера -----------------------
export const logOut = createAppAsyncThunk<{
    isLoggedIn: boolean
}>(
    // 1 - prefix
    'auth/logOut',
    // 2 - Первый параметр - параметры санки, Второй параметр - thunkAPI
    async (_, thunkAPI) => {
        // 3 - деструктурируем параметры
        const {dispatch, rejectWithValue} = thunkAPI

        // Запрос на LogOut
        const logOutData = await authAPI.logOut()

        // Если успех
        if (logOutData.resultCode === ResultCode.success) {

            // Удалили все данные из store после вылогинизации
            dispatch(clearToDoDataAC())

            // Return после ответа от сервера false
            return {isLoggedIn: false}
        } else {

            // Здесь будет упакована ошибка
            return rejectWithValue(logOutData)
        }
    }
)

// *********** Reducer - чистая функция для изменения state после получения action от dispatch ****************
// slice - reducer создаем с помощью функции createSlice
const slice = createSlice({
    // важно чтобы не дублировалось, будет в качестве приставки согласно соглашению redux ducks 🦆
    name: 'auth',
    initialState: {
        isLoggedIn: false as boolean
    },
    // sub-reducers, каждый из которых эквивалентен одному оператору case в switch, как мы делали раньше (обычный redux)
    reducers: {},
    extraReducers: builder => {
        builder
            .addMatcher(
                isFulfilled(authThunks.logIn, authThunks.logOut, authThunks.initializeMe),
                (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
                    state.isLoggedIn = action.payload.isLoggedIn
                })
    }
})

// Создаем authReducer с помощью slice
export const authReducer = slice.reducer

// Thunks упаковываем в объект
export const authThunks = {logOut, logIn, initializeMe}

// Типизация AuthInitialStateType для тестов
export type AuthInitialStateType = ReturnType<typeof slice.getInitialState>
