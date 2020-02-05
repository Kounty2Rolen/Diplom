import React from "react";
import "./App.css";
import { Home } from "./Components/Home";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter
} from "react-router-dom";
import { Menu } from "./Components/Menu";
import { About } from "./Components/About";
import { RegScreen } from "./Components/LoginScreen/Register";
import { Cabinet } from "./Components/Cabinet/Cabinet";
import ProjectInfo from "./Components/Cabinet/Projects/ProjectInfo";

interface state {
  currentPage: string;
}

export class App extends React.Component<{}, state> {
  state = {
    currentPage: "home"
  };
  OnMenuClick = (currentPage: string) => {
    this.setState({ currentPage: currentPage });
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <header>
            <Menu OnMenuClick={this.OnMenuClick}></Menu>
          </header>
          <Switch>
            <Route path="/About" component={About} />
            <Route path="/Home" component={Home} />
            {/*Регистрация и вход */}
            <Route path="/Register" component={RegScreen} />

            {/*Личный кабинет*/}
            <Route path="/Account" component={Cabinet} />
            <Route path="/Project" component={ProjectInfo} />
            <Redirect from="/" to="/Home" />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
