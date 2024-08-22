import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/ui/App";
import { Provider } from "react-redux";
import { store } from "app/model/store";
import { HashRouter } from "react-router-dom";

const rerenderEntireTree = () => {
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <HashRouter>
      <Provider store={store}>

        <App />

      </Provider>
    </HashRouter>
  );
};

rerenderEntireTree();



