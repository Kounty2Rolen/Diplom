import React, { HtmlHTMLAttributes, MouseEventHandler } from 'react';
import logo from './logo.svg';
import './Menu.css'
import { Button, NavbarText } from 'reactstrap'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';
import { LoginScreen } from './LoginScreen/Login'
import { Link } from 'react-router-dom';
import { render } from '@testing-library/react';

interface props {
    OnMenuClick: (currentPage: string) => void;
}
interface state {
    name: string
}



export class Menu extends React.Component<props, state>
{
    constructor(props: any) {
        super(props);
        this.state = { name: '' }
    }
    GetIdentity = () => {
        if (sessionStorage.getItem('Token') == null) {
            return <LoginScreen />
        } else {
            fetch('Account/GetLogin', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem('Token')
                }

            }).then(Response => Response.json()).then(data => this.setState({ name: data }));
        return <a>Hello {this.state.name}<a onClick={this.logOut} href="">, LogOut</a></a>;
        }

    }
    logOut=()=>{
        sessionStorage.removeItem("Token");
    }
    render() {
        return (
            <Navbar className="menu" color="light" light Marker="false" expand="sm" >
                <NavbarBrand color="White">
                    <Link to='/Home' className='homelink' >🏠Home</Link>
                </NavbarBrand>
                <Nav className='mr-auto' navbar>
                    <NavItem>
                        <Button color="light" >
                            <Link to='/About' className="Link">About</Link>
                        </Button>
                    </NavItem>
                </Nav>
                <NavbarText>
                    <this.GetIdentity/>
                </NavbarText>
            </Navbar>
        );


    }
}

