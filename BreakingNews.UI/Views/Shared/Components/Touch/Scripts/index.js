import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../../../../../wwwroot/scripts/store";
import Touches from "./Touches";
import "components/Touches.scss";

ReactDOM.render(
    <Provider store={store}>
        <Touches />
    </Provider>,
    document.getElementById("touchComponent")
);