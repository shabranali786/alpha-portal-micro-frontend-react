import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@crm/shared/store/store";
import FinanceApp from "./App";
import "@crm/shared/styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <FinanceApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
