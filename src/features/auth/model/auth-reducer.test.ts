import { AuthInitialStateType, authReducer, authThunks } from "./auth-reducer";

let startState: AuthInitialStateType

beforeEach(() => {
    startState = {
        isLoggedIn: false,
        captchaUrl:''
    }
})


test('isLoggedIn should be changed', () => {
    const endState = authReducer(startState,
      authThunks.initializeMe.fulfilled({isLoggedIn: true}, 'requestId'))

    expect(endState.isLoggedIn).toEqual(true)
})

test('captchaUrl should be changed', () => {
    const endState = authReducer(startState,
      authThunks.getCaptcha.fulfilled({captcha: 'true'}, 'requestId'))

    expect(endState.captchaUrl).toEqual('true')
})
