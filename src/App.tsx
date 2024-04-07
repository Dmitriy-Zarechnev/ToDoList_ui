import React, { useEffect } from "react";
import "./App.css";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import { appIsInitializedSelector, appStatusSelector } from "state/selectors/app-selector";
import { ErrorSnackbar } from "components/errorSnackBar/ErrorSnackbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { LogIn } from "components/logIn/LogIn";
import { ToDoLists } from "components/toDoLists/ToDoLists";
import { authThunks } from "state/reducers/auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import { isLoggedInSelector } from "state/selectors/auth-selector";
import { useActions } from "utils/useActions";

type AppPropsType = {
  demo?: boolean;
};

function App({ demo = false }: AppPropsType) {
  // Получили status из state используя хук - useSelector и selector - appStatusSelector
  const status = useSelector(appStatusSelector);
  // Получили isInitialized из state используя хук - useSelector и selector - appIsInitializedSelector
  const isInitialized = useSelector(appIsInitializedSelector);
  // Получили isLoggedIn из state используя хук - useSelector и selector - isLoggedInSelector
  const isLoggedIn = useSelector(isLoggedInSelector);


  // useActions - это кастомный хук, который уже протипизирован и лежит в useActions
  const { initializeMeTC, logOutTC } = useActions(authThunks);

  useEffect(() => {
    if (!demo) {
      initializeMeTC();
      // dispatch(initializeMeTC());
    }
  }, []);

  // Крутилка во время инициализации
  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  // Функция для вылогинизации
  const onClickHandler = () => {
    isLoggedIn ? logOutTC() : <Navigate to={"/login"} />;
  };

  return (
    <div className="App">
      {/*ErrorSnackbar который показываем во время ошибки*/}
      <ErrorSnackbar />

      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            TodoList
          </Typography>
          <Button color={"inherit"} onClick={onClickHandler}>
            {isLoggedIn ? "LogOut" : "LogIn"}
          </Button>
        </Toolbar>

        {/*Preloader который показываем во время связи с сервером*/}
        {status === "loading" && <LinearProgress />}
      </AppBar>

      <Container fixed>
        <Routes>
          <Route path={"/"} element={<ToDoLists demo={demo} />} />
          <Route path={"/login"} element={<LogIn />} />

          <Route path={"/*"} element={<h1>404: PAGE NOT FOUND</h1>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
