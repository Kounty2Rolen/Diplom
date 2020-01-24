import React, { HtmlHTMLAttributes, MouseEventHandler } from 'react';
import logo from './logo.svg';
import { Button, ButtonGroup } from 'reactstrap'
import './App.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { Home } from './Components/Home'
import { Menu } from './Components/Menu'
import { Main } from './Components/Main'
import { Route, Switch } from 'react-router-dom'
interface state {
  currentPage: string;
}

export class App extends React.Component<{}, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPage: 'home'
    }
  }

  onClickHandler = () => {
    this.setState({ currentPage: 'about' });
  }

  render() {
    return (
      <div className="App">

        <header>
          <Navbar color="light" light Marker="false" expand="sm">
            <NavbarBrand color="White" onClick={() => this.setState({ currentPage: 'home' })} href="#">🏠Home</NavbarBrand>
            <Nav className='mr-auto' navbar>
              <NavItem>
                <Button color="light" onClick={this.onClickHandler}>AboutUs</Button>
              </NavItem>
            </Nav>
          </Navbar>
          <Main currentPage={this.state.currentPage}></Main>
        </header>
      </div>
    );
  }
}