import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import S from "./LogIn.module.css";
import { useLogIn } from "common/hooks/useLogIn";
import { authSelectors } from "features/auth/model/auth-reducer";


export const LogIn = () => {
  // Получили isLoggedIn из state используя хук - useSelector и selector - authSelectors
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

  // Получили captchaUrl из state используя хук - useSelector и selector - authSelectors
  const captchaUrl = useSelector(authSelectors.selectCaptchaUrl);

  // Получили formik используя кастомный хук
  const { formik } = useLogIn();


  // Redirect в случае isLoggedIn === true
  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit} className={S.form}>
          <FormControl>
            <FormLabel>
              <p className={S.text}>
                To log in get registered
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"} className={S.link}>
                  here
                </a>
              </p>
              <p className={S.text}>or use common test account credentials:</p>
              <p className={S.text}>
                Email: <span className={S.span}>free@samuraijs.com</span>
              </p>
              <p className={S.text}>
                Password: <span className={S.span}>free</span>
              </p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                type={"email"}
                margin="normal"
                {...formik.getFieldProps("email")}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className={S.error}>{formik.errors.email}</div>
              ) : null}

              <TextField
                label="Password"
                type="password"
                margin="normal"
                {...formik.getFieldProps("password")}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className={S.error}>{formik.errors.password}</div>
              ) : null}

              <FormControlLabel
                label={"Remember me"}
                control={
                  <Checkbox
                    onChange={formik.handleChange}
                    checked={formik.values.rememberMe}
                    name={"rememberMe"}
                    color={"success"}
                  />
                }
              />
              {captchaUrl && <> <img src={captchaUrl} alt="captcha-here" />
                <TextField
                  label="captcha"
                  type="captcha"
                  margin="normal"
                  {...formik.getFieldProps("captcha")}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.captcha && formik.errors.captcha ? (
                  <div className={S.error}>{formik.errors.captcha}</div>
                ) : null}
              </>}

              <Button type={"submit"} variant={"contained"} color={"success"}>
                LogIn
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
