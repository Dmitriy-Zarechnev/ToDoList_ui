import {AuthInitialStateType, authReducer, initializeMe} from './auth-reducer'

let startState: AuthInitialStateType

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})


test('isLoggedIn should be changed', () => {
    const endState = authReducer(startState,
        initializeMe.fulfilled({isLoggedIn: true}, 'requestId'))

    expect(endState.isLoggedIn).toEqual(true)
})
