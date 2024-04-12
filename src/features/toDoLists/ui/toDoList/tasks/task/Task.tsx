import React, { ChangeEvent, FC, memo } from "react";
import S from "./Task.module.css";
import Checkbox from "@mui/material/Checkbox";
import { EditableSpan } from "components/editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TasksType } from "features/toDoLists/api/tasks-api";
import { RequestStatusType } from "app/model/app-reducer";
import { TasksStatuses } from "utils/api/enums";
import { useActions } from "utils/hooks/useActions";
import { tasksThunks } from "../../../../model/tasks/tasks-reducer";

type TaskPropsType = {
  task: TasksType
  entityStatus: RequestStatusType
  toDoListID: string
};

export const Task: FC<TaskPropsType> = memo(
  ({ task, entityStatus, toDoListID }) => {

    // Используя useAction получили callbacks в которые уже входит dispatch
    const { deleteTaskTC, updateTaskStatusTC, updateTaskTitleTC } = useActions(tasksThunks);


    // -------------- Изменяем Task status ----------------
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const status =
        e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New;

      updateTaskStatusTC({ toDoListID, taskId: task.id, status });
    };


    // -------------- Удаление task ----------------
    const removeTaskHandler = () => {
      deleteTaskTC({ toDoListID, taskId: task.id });
    };


    // -------------- Меняем Task's title ----------------
    const changeTaskTitleHandler = (newTitle: string) => {
      updateTaskTitleTC({ toDoListID, taskId: task.id, title: newTitle });
    };


    return (
      <div className={task.status === TasksStatuses.Completed
        ? `${S.task__list} ${S.is_done}` : S.task__list}>
        <div className={S.task__list_box}>
          <Checkbox
            color={"success"}
            checked={task.status === TasksStatuses.Completed}
            onChange={changeTaskStatusHandler}
            disabled={entityStatus === "loading"} />

          <EditableSpan value={task.title}
                        onChange={(newTitle) => changeTaskTitleHandler(newTitle)}
                        disabled={entityStatus} />
        </div>

        <IconButton
          aria-label="delete"
          size="small"
          onClick={removeTaskHandler}
          disabled={entityStatus === "loading"}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }
);
