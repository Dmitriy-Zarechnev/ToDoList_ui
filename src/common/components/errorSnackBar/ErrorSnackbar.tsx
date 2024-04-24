import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { useActions } from "common/hooks/useActions";
import { appActions, appSelectors } from "app/model/app-reducer";


export const ErrorSnackbar = () => {
  // Получили error из state используя хук - useSelector и selector - appSelectors
  const error = useSelector(appSelectors.selectAppError);

  // Получили status из state используя хук - useSelector и selector - appSelectors
  const status = useSelector(appSelectors.selectAppStatus);

  // Используя useAction получили callbacks в которые уже входит dispatch
  const { setAppStatus, setAppError } = useActions(appActions);

  // Закрытие Snackbar при кликах
  const handleClose = () => {
    setAppStatus({ status: "idle" });
    setAppError({ error: null });
  };

  // Snackbar универсальный
  const universalSnackBar = (open: boolean,
                             severity: "error" | "success",
                             text: string | null,
                             variant: "filled" | "outlined" = "outlined") => {
    return <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={handleClose} severity={severity}
             sx={{ width: "100%" }} variant={variant}>
        {text}
      </Alert>
    </Snackbar>;
  };


  return <>
    {universalSnackBar(error !== null, "error", error, "filled")}
    {universalSnackBar(status === "succeeded", "success", "Success loading!😉")}
    {universalSnackBar(status === "updated", "success", "Success update!😃", "filled")}
  </>;
};
