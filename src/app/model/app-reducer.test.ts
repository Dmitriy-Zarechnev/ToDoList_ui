import {AppInitialStateType, appReducer, setAppErrorAC, setAppInitializedAC, setAppStatusAC} from './app-reducer'

let startState: AppInitialStateType

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false
    }
})


test('status should be changed', () => {
    const endState = appReducer(startState, setAppStatusAC({status: 'succeeded'}))

    expect(endState.status).toEqual('succeeded')
})


test('error should be changed', () => {
    const endState = appReducer(startState, setAppErrorAC({error: 'Hello Error'}))

    expect(endState.error).toEqual('Hello Error')
})


test('isInitialized should be changed', () => {
    const endState = appReducer(startState, setAppInitializedAC({isInitialized: true}))

    expect(endState.isInitialized).toEqual(true)
})
