import axios from "axios";


// ----- Объект экземпляр для избежания дублирования ------
export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "d9bbcdc0-0dbd-4e98-ab2c-6652c2ba0fb0"
  }
});