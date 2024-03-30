import { authReducer, setIsLoggedInAC } from "../reducers/auth-reducer";

let startState: {
  isLoggedIn: false;
};

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  };
});

test("isLoggedIn should be changed", () => {
  const endState = authReducer(startState, setIsLoggedInAC({ isLoggedIn: true }));

  expect(endState.isLoggedIn).toEqual(true);
});
