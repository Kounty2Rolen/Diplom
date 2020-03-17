import React from "react";
import { Link } from "react-router-dom";
import { Button, NavbarText } from "reactstrap";
import { Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import GetInfo from "../Services/AccountServicesGetInfo";
import { LoginScreen } from "./LoginScreen/Login";
import "./Menu.css";

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
  public componentDidMount() {
    this.GetIdentity();
  }
  // componentDidUpdate(prevProps: props, prevState: state) {
  //     if (prevState.name !== this.state.name) {
  //         this.GetIdentity();
  //     }
  // }
  public GetIdentity = () => {
    if (sessionStorage.getItem("Token")) {
      GetInfo.getIdentity().then((data: any) => this.setState({ name: data }));
    }
  };
  public logOut = () => {
    sessionStorage.removeItem("Token");
  };
  public render() {
    const name = this.state.name;
    const token = sessionStorage.getItem("Token");
    const func = this.logOut;

    return (
      <Navbar className="menu" color="light" light marker="false" expand="sm">
        <NavbarBrand color="White">
          <Link to="/Home" className="homelink">
            <span role="img">🏠</span>Home
          </Link>
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavItem>
            {token ? (
              <Link to="/Account" className="Link">
                <Button color="light">Edit account</Button>
              </Link>
            ) : null}
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
