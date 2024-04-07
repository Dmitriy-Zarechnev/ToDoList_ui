import React, { memo, useCallback, useEffect } from "react";
import S from "./ToDoList.module.css";
import { AddItemForm } from "../addItemForm/AddItemForm";
import { EditableSpan } from "../editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Task } from "../task/Task";
import { useSelector } from "react-redux";
import { FilterValuesType, toDoListsActions, toDoListsThunks } from "state/reducers/todolists-reducer";
import { tasksThunks } from "state/reducers/tasks-reducer";
import { tasksSelector } from "state/selectors/tasks-selector";
import { RequestStatusType } from "state/reducers/app-reducer";
import { TasksStatuses } from "api/enums";
import { useActions } from "utils/useActions";


type TodoListPropsType = {
  id: string;
  title: string;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
  demo?: boolean;
};

export const ToDoList = memo(({ demo = false, ...props }: TodoListPropsType) => {
  // Получили tasks из state используя хук - useSelector и selector - tasksSelector
  const tasks = useSelector(tasksSelector);

  // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
  //const dispatch = useAppDispatch();

  const { changeTodolistFilterAC } = useActions(toDoListsActions);
  const { updateTodoListsTC, deleteTodoListsTC } = useActions(toDoListsThunks);

  const { getTasksTC, addTaskTC, deleteTaskTC, updateTaskStatusTC, updateTaskTitleTC } = useActions(tasksThunks);

  // -------------- Получили Tasks с сервера после загрузки страницы ----------------
  useEffect(() => {
    if (!demo) {
      getTasksTC(props.id);
    }
  }, []);

  // -------------- Меняем название todolist ----------------
  const changeToDoListTitle = useCallback(
    (newTitle: string) => {
      updateTodoListsTC({ toDoListID: props.id, title: newTitle });
    },
    [props.id]
  );

  // -------------- Добавление task ----------------
  const addTask = useCallback(
    (title: string) => {
      addTaskTC({ toDoListID: props.id, title });
    },
    [props.id]
  );


  // -------------- Фильтрация task ----------------
  const onClickBtnHandler = useCallback(
    (value: FilterValuesType) => {
      changeTodolistFilterAC({ toDoListID: props.id, filter: value });
    },
    [props.id]
  );


  // -------------- Удаление task ----------------
  const onClickRemoveHandler = useCallback(
    (id: string) => {
      deleteTaskTC({ toDoListID: props.id, taskId: id });
    },
    [props.id]
  );

  // -------------- Меняем checkbox ----------------
  const onChangeStatusHandler = useCallback(
    (taskId: string, status: TasksStatuses) => {
      updateTaskStatusTC({ toDoListID: props.id, taskId, status });
    },
    [props.id]
  );

  // -------------- Удалить ToDoList ----------------
  const onClickDeleteListHandler = useCallback(() => {
    deleteTodoListsTC(props.id);
  }, [props.id]);

  // -------------- Меняем Task's title ----------------
  const changeTaskTitle = useCallback(
    (id: string, newTitle: string) => {
      updateTaskTitleTC({ toDoListID: props.id, taskId: id, title: newTitle });
    },
    [props.id]
  );

  // -------------- Фильтрация Tasks ----------------
  let tasksForToDoList = tasks[props.id];

  if (props.filter === "active") {
    tasksForToDoList = tasksForToDoList.filter((task) => task.status === TasksStatuses.New);
  }

  if (props.filter === "completed") {
    tasksForToDoList = tasksForToDoList.filter((task) => task.status === TasksStatuses.Completed);
  }

  return (
    <div className={S.to_Do_List}>
      <div className={S.to_Do_List__top}>
        <EditableSpan
          value={props.title}
          newClass={S.to_Do_List__header}
          onChange={changeToDoListTitle}
          disabled={props.entityStatus}
        />

        <IconButton aria-label="delete"
                    onClick={onClickDeleteListHandler}
                    disabled={props.entityStatus === "loading"}>
          <DeleteIcon />
        </IconButton>
      </div>

      <AddItemForm addItem={addTask} itemType={"Task"} disabled={props.entityStatus} />

      <div className={S.to_Do_List__lists}>
        {tasksForToDoList.map((el) => {
          return (
            <Task
              key={el.id}
              task={el}
              changeTaskTitle={(newTitle) => changeTaskTitle(el.id, newTitle)}
              onChangeStatusHandler={onChangeStatusHandler}
              onClickRemoveHandler={onClickRemoveHandler}
              entityStatus={el.entityTaskStatus}
            />
          );
        })}
        {tasksForToDoList.length === 0 && (
          <span className={S.no_tasks}>
            {props.filter === "active" ? "No active tasks"
              : props.filter === "completed" ? "No completed tasks"
                : "No tasks"}
          </span>
        )}

      </div>
      <div className={S.to_Do_List__btn_lists}>
        <Button
          variant={props.filter === "all" ? "outlined" : "text"}
          onClick={() => {
            onClickBtnHandler("all");
          }}
          color={"secondary"}
        >
          {" "}
          All
        </Button>

        <Button
          variant={props.filter === "active" ? "outlined" : "text"}
          onClick={useCallback(() => {
            onClickBtnHandler("active");
          }, [])}
        >
          {" "}
          Active
        </Button>

        <Button
          variant={props.filter === "completed" ? "outlined" : "text"}
          onClick={useCallback(() => {
            onClickBtnHandler("completed");
          }, [])}
          color={"success"}
        >
          {" "}
          Completed
        </Button>
      </div>
    </div>
  );
});
