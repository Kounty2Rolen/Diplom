import React, { HtmlHTMLAttributes, MouseEventHandler } from 'react';
import logo from './logo.svg';
import { Button, ButtonGroup } from 'reactstrap'
import './App.css';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';
import { Home } from './Components/Home'
import { Main } from './Components/Main'
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom'
import { Menu } from './Components/Menu'
import { About } from './Components/About';
import {LoginScreen} from './Components/LoginScreen/Login'
import {RegScreen} from './Components/LoginScreen/Register'


interface state {
  currentPage: string;
}

export class App extends React.Component<{}, state> {

  state = {
    currentPage: "home"
  }
  OnMenuClick = (currentPage: string) => {

    this.setState({ currentPage: currentPage })

  }


  render() {
    return (
      <div className="App">

        <BrowserRouter>
        <header>
          <Menu OnMenuClick={this.OnMenuClick}></Menu>
        </header>
          <Switch>
            <Route path='/About' component={About} />
            <Route path='/Home' component={Home} />
            {/*Регистрация и вход */}
            <Route path='/Register' component={RegScreen} />

            <Redirect from='/' to='/Home' />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}