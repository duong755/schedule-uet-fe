import React from "react";
import ReactDOM from "react-dom";
import { NavLink, Route, BrowserRouter, Switch } from "react-router-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";

import { Header } from "./common/components/Header/Header";

import { Schedule } from "./pages/Schedule/Schedule";
import { ClassMembers } from "./pages/ClassMembers/ClassMembers";
import { Exam } from "./pages/Exam/Exam";
import { Contact } from "./pages/Contact/Contact";

import { CombinedProvider } from "./context/CombinedProvider";

const links = [
  {
    path: "/",
    exact: true,
    name: "Thời khóa biểu",
    child: <Schedule />,
  },
  {
    path: "/classmembers",
    name: "Danh sách lớp",
    child: <ClassMembers />,
  },
  {
    path: "/exam",
    name: "Lịch thi",
    child: <Exam />,
  },
  {
    path: "/contact",
    name: "Liên hệ",
    child: <Contact />,
  },
];

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <CombinedProvider>
      <BrowserRouter>
        <nav>
          <ul>
            {links.map((link) => {
              return (
                <li key={link.path}>
                  <NavLink exact={link.exact} to={link.path} activeClassName="active-route">
                    {link.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <Switch>
          {links.map((link) => {
            return (
              <Route key={link.path} exact={link.exact} path={link.path}>
                {link.child}
              </Route>
            );
          })}
        </Switch>
      </BrowserRouter>
    </CombinedProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
