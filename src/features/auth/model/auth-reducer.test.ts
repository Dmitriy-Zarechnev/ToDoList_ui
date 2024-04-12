import { AuthInitialStateType, authReducer, authThunks } from "./auth-reducer";

let startState: AuthInitialStateType

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})


test('isLoggedIn should be changed', () => {
    const endState = authReducer(startState,
      authThunks.initializeMe.fulfilled({isLoggedIn: true}, 'requestId'))

    expect(endState.isLoggedIn).toEqual(true)
})
