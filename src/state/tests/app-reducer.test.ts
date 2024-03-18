import {appReducer, InitialStateType,setAppErrorAC, setAppStatusAC} from '../app-reducer'


let startState: InitialStateType

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null
    }
})


test('status should be changed', () => {

    const endState = appReducer(startState, setAppStatusAC('succeeded'))

    expect(endState.status).toEqual('succeeded')
})


test('error should be changed', () => {

    const endState = appReducer(startState, setAppErrorAC('Hello Error'))

    expect(endState.error).toEqual('Hello Error')
})