import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { Cabinet } from "./Components/Cabinet/Cabinet";
import ProjectInfo from "./Components/Cabinet/Projects/ProjectInfo";
import { Home } from "./Components/Home";
import { RegScreen } from "./Components/LoginScreen/Register";
import { Menu } from "./Components/Menu";
import ModelEditor from "./Components/Cabinet/Projects/ModelEditor/ModelEditor";

interface state {
    currentPage: string;
}

export class App extends React.Component<{}, state> {
    public state = {
        currentPage: "home"
    };
    public OnMenuClick = (currentPage: string) => {
        this.setState({ currentPage });
    };

    public render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <header>
                        <Menu OnMenuClick={this.OnMenuClick}></Menu>
                    </header>
                    <Switch>
                        <Route exact={true} path="/Home" component={Home} />
                        {/*Регистрация и вход */}
                        <Route exact={true} path="/Register" component={RegScreen} />

                        {/*Личный кабинет*/}
                        <Route exact={true} path="/Account" component={Cabinet} />
                        <Route
                            exact={true}
                            path="/Account/Project/:ProjectId"
                            component={ProjectInfo}
                        />
                        {/* Педактор модели */}
                        <Route
                            exact={true}
                            path="/Account/Projects/ModelEditor/:File"
                            component={ModelEditor}
                        />

                        <Redirect from="/" to="/Home" />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}