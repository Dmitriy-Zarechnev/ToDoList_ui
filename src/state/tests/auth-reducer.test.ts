import {AuthInitialStateType, authReducer, initializeMeTC} from '../reducers/auth-reducer'

let startState: AuthInitialStateType

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})


test('isLoggedIn should be changed', () => {
    const endState = authReducer(startState,
        initializeMeTC.fulfilled({isLoggedIn: true}, 'requestId'))

    expect(endState.isLoggedIn).toEqual(true)
})
