import React from "react";
import { Provider } from "react-redux";
import { tasksReducer } from "features/toDoLists/model/tasks/tasks-reducer";
import { toDoListsReducer } from "features/toDoLists/model/toDoLists/todolists-reducer";
import { v1 } from "uuid";
import { AppRootStateType } from "app/model/store";
import { TasksPriorities, TasksStatuses } from "common/api/enums";
import { appReducer } from "app/model/app-reducer";
import { thunk } from "redux-thunk";
import { authReducer } from "features/auth/model/auth-reducer";
import { HashRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";


const initialGlobalState: AppRootStateType = {
  tasks: {
    ["todolistId1"]: [
      {
        id: v1(),
        title: "HTML&CSS",
        status: TasksStatuses.Completed,
        priority: TasksPriorities.Low,
        deadline: "",
        order: 0,
        startDate: "",
        description: "Hello",
        addedDate: "",
        todoListId: "TodolistId",
        entityTaskStatus: "idle"
      },
      {
        id: v1(),
        title: "JS",
        status: TasksStatuses.New,
        priority: TasksPriorities.Low,
        deadline: "",
        order: 0,
        startDate: "",
        description: "Hello",
        addedDate: "",
        todoListId: "TodolistId",
        entityTaskStatus: "idle"
      }
    ],
    ["todolistId2"]: [
      {
        id: v1(),
        title: "Milk",
        status: TasksStatuses.New,
        priority: TasksPriorities.Low,
        deadline: "",
        order: 0,
        startDate: "",
        description: "Hello",
        addedDate: "",
        todoListId: "TodolistId",
        entityTaskStatus: "idle"
      },
      {
        id: v1(),
        title: "React Book",
        status: TasksStatuses.Completed,
        priority: TasksPriorities.Low,
        deadline: "",
        order: 0,
        startDate: "",
        description: "Hello",
        addedDate: "",
        todoListId: "TodolistId",
        entityTaskStatus: "idle"
      }
    ]
  },
  toDoLists: [
    {
      id: "todolistId1",
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle"
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle"
    }
  ],
  app: {
    status: "idle",
    error: null,
    isInitialized: true
  },
  auth: {
    isLoggedIn: true,
    captchaUrl:''
  }
};

export const storyBookStore = configureStore({
  reducer: {
    tasks: tasksReducer,
    toDoLists: toDoListsReducer,
    app: appReducer,
    auth: authReducer
  },
  preloadedState: initialGlobalState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
});

// Декоратор, предоставляющий доступ к Redux-хранилищу в историях
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};

// Декоратор, предоставляющий доступ к Redux-хранилищу в историях
export const HashRouterDecorator = (storyFn: () => React.ReactNode) => {
  return <HashRouter>{storyFn()}</HashRouter>;
};
