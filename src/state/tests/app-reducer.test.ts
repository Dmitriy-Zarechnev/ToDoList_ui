import {
  appReducer,
  AppInitialStateType,
  setAppErrorAC,
  setAppInitializedAC,
  setAppStatusAC,
} from "../reducers/app-reducer";

let startState: AppInitialStateType;

beforeEach(() => {
  startState = {
    status: "idle",
    error: null,
    isInitialized: false,
  };
});

test("status should be changed", () => {
  const endState = appReducer(startState, setAppStatusAC("succeeded"));

  expect(endState.status).toEqual("succeeded");
});

test("error should be changed", () => {
  const endState = appReducer(startState, setAppErrorAC("Hello Error"));

  expect(endState.error).toEqual("Hello Error");
});

test("isInitialized should be changed", () => {
  const endState = appReducer(startState, setAppInitializedAC(true));

  expect(endState.isInitialized).toEqual(true);
});
