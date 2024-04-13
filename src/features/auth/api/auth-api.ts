import { ResponseType } from "../../toDoLists/api/todolist-api";
import { instance } from "utils/api/common.api";

// ----- Типизация данных для сервера ------
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha: string;
};

// ----- Типизация me ответа ------
export type MeResponseType = {
  id: number;
  email: string;
  login: string;
};

// Типизация для captcha запроса
type CaptchaResponseType = {
  url: string,
}

export const authAPI = {
  // ----- Логинизация на сервере ------
  logIn(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>(`auth/login`, data)
      .then((res) => res.data); // logInData
  },

  // ----- Вылогинизация с сервера ------
  logOut() {
    return instance.delete<ResponseType>(`auth/login`)
      .then((res) => res.data); // logOutData
  },

  // ----- Проверка при входе ------
  me() {
    return instance.get<ResponseType<MeResponseType>>(`auth/me`)
      .then((res) => res.data); // meData
  },

  // ----- Get captcha ------
  getCaptcha() {
    return instance.get<CaptchaResponseType>(`security/get-captcha-url`)
      .then((res) => res.data); // captchaData
  }
};
