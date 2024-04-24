import React, { memo, useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components/addItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import { ToDoList } from "./ui/toDoList/ToDoList";
import { toDoListsSelectors, toDoListsThunks } from "features/toDoLists/model/toDoLists/todolists-reducer";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useActions } from "common/hooks/useActions";
import { authSelectors } from "features/auth/model/auth-reducer";


export const ToDoLists = memo(({ demo = false }: { demo: boolean }) => {
  // Получили toDoLists из state используя хук - useSelector и selector - toDoListsSelectors
  const toDoLists = useSelector(toDoListsSelectors.selectToDoLists);

  // Получили isLoggedIn из state используя хук - useSelector и selector - authSelectors
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

  // Используя useAction получили callbacks в которые уже входит dispatch
  const { getTodoLists, addTodoLists } = useActions(toDoListsThunks);


  // -------------- Получили ToDoLists с сервера после загрузки страницы ----------------
  useEffect(() => {
    // Проверка, чтоб лишний раз не грузить toDoLists
    if (!isLoggedIn) return;

    // Получаем toDoLists
    if (!demo) getTodoLists();
  }, []);


  // -------------- Добавить ToDoList ----------------
  const addToDoList = useCallback((title: string) => {
    return addTodoLists(title).unwrap();
  }, []);


  // Redirect в случае isLoggedIn !== true
  if (!isLoggedIn) return <Navigate to={"/login"} />;


  return (
    <div>
      <Grid container>
        <AddItemForm addItem={addToDoList} itemType={"Todolist"} />
      </Grid>

      <Grid container spacing={1}>
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
