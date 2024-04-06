import React, { memo, useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "../addItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import { ToDoList } from "../toDoList/ToDoList";
import {  toDoListsThunks } from "state/reducers/todolists-reducer";
import { useSelector } from "react-redux";
import { toDoListsSelector } from "state/selectors/todolists-selector";
import { Navigate } from "react-router-dom";
import { isLoggedInSelector } from "state/selectors/auth-selector";
import { useActions } from "utils/useActions";

export const ToDoLists = memo(({ demo = false }: { demo: boolean }) => {
  // Получили toDoLists из state используя хук - useSelector и selector - toDoListsSelector
  const toDoLists = useSelector(toDoListsSelector);

  // Получили isLoggedIn из state используя хук - useSelector и selector - isLoggedInSelector
  const isLoggedIn = useSelector(isLoggedInSelector);

  // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
  //const dispatch = useAppDispatch();

  const { getTodoListsTC, addTodoListsTC} = useActions(toDoListsThunks);
  // -------------- Получили ToDoLists с сервера после загрузки страницы ----------------
  useEffect(() => {
    // Проверка, чтоб лишний раз не грузить todolists
    if (!isLoggedIn) {
      return;
    }

    if (!demo) {
      getTodoListsTC();
    }
  }, []);

  // -------------- Добавить ToDoList ----------------
  const addToDoList = useCallback((title: string) => {
    addTodoListsTC(title)
  }, []);

  // Redirect в случае отсутствия логинизации
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <Grid container>
        <AddItemForm addItem={addToDoList} itemType={"Todolist"} />
      </Grid>

      <Grid container spacing={3}>
        {toDoLists.map((el) => {
          return (
            <Grid item key={el.id}>
              <Paper style={{ padding: "10px" }}>
                <ToDoList
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  filter={el.filter}
                  entityStatus={el.entityStatus}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
});
