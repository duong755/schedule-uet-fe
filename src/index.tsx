import React from "react";
import ReactDOM from "react-dom";
import { NavLink, Route, BrowserRouter, Switch } from "react-router-dom";
import "./index.scss";

import { Header } from "./Header/Header";
import { Schedule } from "./Schedule/Schedule";
import { ScheduleProvider } from "./context/ScheduleContext";
import { ClassMembers } from "./ClassMembers/ClassMembers";
import { Exam } from "./Exam/Exam";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <ScheduleProvider>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <NavLink exact={true} to="/" activeClassName="active-route">
                Thời khóa biểu
              </NavLink>
            </li>
            <li>
              <NavLink to="/classmembers" activeClassName="active-route">
                Danh sách lớp
              </NavLink>
            </li>
            <li>
              <NavLink to="/exam" activeClassName="active-route">
                Lịch thi
              </NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <Schedule />
          </Route>
          <Route path="/classmembers">
            <ClassMembers />
          </Route>
          <Route path="/exam">
            <Exam />
          </Route>
        </Switch>
      </BrowserRouter>
    </ScheduleProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
