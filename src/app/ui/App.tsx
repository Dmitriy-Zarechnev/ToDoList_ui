import React, { useEffect, useState } from "react";
import S from "./App.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import { ErrorSnackbar } from "common/components/errorSnackBar/ErrorSnackbar";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { LogIn } from "features/auth/ui/LogIn";
import { ToDoLists } from "features/toDoLists/ToDoLists";
import { authSelectors, authThunks } from "features/auth/model/auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import { useActions } from "common/hooks/useActions";
import { ErrorPage } from "common/components/errorPage/ErrorPage";
import { appSelectors } from "app/model/app-reducer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Switch } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline'

type ThemeMode = "dark" | "light"

type AppPropsType = {
  demo?: boolean;
};

function App({ demo = false }: AppPropsType) {
  // Локальный state для темы
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  // Получили status из state используя хук - useSelector и selector - appSelectors
  const status = useSelector(appSelectors.selectAppStatus);
  // Получили isInitialized из state используя хук - useSelector и selector - appSelectors
  const isInitialized = useSelector(appSelectors.selectAppIsInitialized);
  // Получили isLoggedIn из state используя хук - useSelector и selector - authSelectors
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

  // useActions - это кастомный хук, который уже протипизирован и лежит в useActions
  const { initializeMe, logOut } = useActions(authThunks);

  useEffect(() => {
    if (!demo) initializeMe();
  }, []);

  // Крутилка во время инициализации
  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  // Функция для logOut
  const onClickHandler = () => {
    isLoggedIn ? logOut() : <Navigate to={"/login"} />;
  };


  const changeModeHandler = () => {
    setThemeMode(themeMode == 'light' ? 'dark' : 'light')
  }


  // Добавили theme нашему app
  const theme = createTheme({
    palette: {
      mode: themeMode === 'light' ? 'light' : 'dark',
      primary: {
        main: "#009688"
      },
      secondary: {
        main: "#ff9100"
      }
    }
  });


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/*ErrorSnackbar который показываем во время ошибки*/}
        <ErrorSnackbar />

        {/*Header для приложения*/}
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <NavLink to={"/"} className={S.link_to_app}>ToDoList ☢</NavLink>
            </Typography>
            <Button color={"warning"}
                    onClick={onClickHandler}
                    size="medium"
                    variant={"contained"}>
              {isLoggedIn ? "Log Out 📛"
                : <NavLink to={"/login"} className={S.link_to_login}>Log In</NavLink>}
            </Button>
            <Switch color={'default'} onChange={changeModeHandler} />
          </Toolbar>

          {/*Preloader который показываем во время связи с сервером*/}
          {status === "loading" && <LinearProgress />}
        </AppBar>

        {/*Routes для приложения*/}
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<ToDoLists demo={demo} />} />
            <Route path={"/login"} element={<LogIn />} />

            <Route path={"/*"} element={<ErrorPage />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
