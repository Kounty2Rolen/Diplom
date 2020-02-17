import React from "react";
import "./Menu.css";
import { Button, NavbarText } from "reactstrap";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { LoginScreen } from "./LoginScreen/Login";
import { Link } from "react-router-dom";
import GetInfo from "../Services/AccountServicesGetInfo";

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
    public GetIdentity = () => {
        if (sessionStorage.getItem("Token")) {
            GetInfo.getIdentity().then((data: any) => this.setState({ name: data }));
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
            <Navbar className="menu" color="light" light marker="false" expand="sm">
                <NavbarBrand color="White">
                    <Link to="/Home" className="homelink">
                        <span role="img">🏠</span>Home
          </Link>
                </NavbarBrand>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <Link to="/About" className="Link">
                            <Button color="light">About</Button>
                        </Link>
                    </NavItem>
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