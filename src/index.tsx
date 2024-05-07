import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/ui/App";
import { Provider } from "react-redux";
import { store } from "app/model/store";
import { BrowserRouter } from "react-router-dom";

const rerenderEntireTree = () => {
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

rerenderEntireTree();



