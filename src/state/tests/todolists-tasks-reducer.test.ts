import { tasksReducer, TasksInitialStateType } from "../reducers/tasks-reducer";
import { addTodolistAC, clearToDoDataAC, ToDoListDomainType, toDoListsReducer } from "../reducers/todolists-reducer";
import { v1 } from "uuid";
import { TasksPriorities, TasksStatuses } from "api/tasks-api";

test("ids should be equals", () => {
  const startTasksState: TasksInitialStateType = {};
  const startTodolistsState: Array<ToDoListDomainType> = [];

  const action = addTodolistAC({title:"new todolist", toDoListID:"todolistId3"});

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = toDoListsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.toDoListID);
  expect(idFromTodolists).toBe(action.payload.toDoListID);
});

test("tasks and todolists should be empty", () => {
  const startTasksState: TasksInitialStateType = {
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
        entityTaskStatus: "idle",
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
        entityTaskStatus: "idle",
      },
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
        entityTaskStatus: "idle",
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
        entityTaskStatus: "idle",
      },
    ],
  };
  const startTodolistsState: Array<ToDoListDomainType> = [
    {
      id: "todolistId1",
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ];

  const endTasksState = tasksReducer(startTasksState, clearToDoDataAC());
  const endTodolistsState = toDoListsReducer(startTodolistsState, clearToDoDataAC());

  expect(endTasksState).toEqual({});
  expect(endTodolistsState).toEqual([]);
});
