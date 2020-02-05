import React from "react";
import "./Menu.css";
import { Button, NavbarText } from "reactstrap";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { LoginScreen } from "./LoginScreen/Login";
import { Link } from "react-router-dom";

interface props {
  OnMenuClick: (currentPage: string) => void;
}
interface state {
  name: string;
}

export class Menu extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { name: "" };
  }
  componentDidMount() {
    this.GetIdentity();
  }
  // componentDidUpdate(prevProps: props, prevState: state) {
  //     if (prevState.name !== this.state.name) {
  //         this.GetIdentity();
  //     }
  // }
  GetIdentity = () => {
    if (sessionStorage.getItem("Token")) {
      fetch("Account/GetLogin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token")
        }
      })
        .then(Response => Response.json())
        .then(data => this.setState({ name: data }));
      // return ;
    }
  };
  logOut = () => {
    sessionStorage.removeItem("Token");
  };
  render() {
    let name = this.state.name;
    let token = sessionStorage.getItem("Token");
    let func = this.logOut;

    return (
      <Navbar className="menu" color="light" light Marker="false" expand="sm">
        <NavbarBrand color="White">
          <Link to="/Home" className="homelink">
            <span role="img">🏠</span>Home
          </Link>
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <Button color="light">
              <Link to="/About" className="Link">
                About
              </Link>
            </Button>
          </NavItem>
          <NavItem>
            <Button color="light">
              <Link to="/Account" className="Link">
                Edit account
              </Link>
            </Button>
          </NavItem>
        </Nav>
        <NavbarText>
          {token ? (
            <p className="nameonmenu">
              {" "}
              Hello {name}
              <a onClick={func} href="">
                , LogOut
              </a>
            </p>
          ) : (
            <LoginScreen />
          )}
        </NavbarText>
        
      </Navbar>
    );
  }
}
