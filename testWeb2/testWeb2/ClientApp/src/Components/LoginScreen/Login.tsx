import sha256 from "crypto-js/sha256";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import GetInfo from "../../Services/AccountServicesGetInfo";
import "./LoginScreen.css";

export const LoginScreen = () => {
    const Person = {
        LoginName: "",
        Password: ""
    };
    const Login = () => {
        Person.Password = sha256(Person.Password).toString();
        if (Person.LoginName === "" || Person.Password === "") {
            alert("Please check all fields, login and password not can be empty !");
        } else if (Person.LoginName !== "" && Person.Password !== "") {
            GetInfo.getToken(Person)
                .then((token: any) => sessionStorage.setItem("Token", token))
                .then(() => {
                    if (sessionStorage.getItem("Token") !== "") {
                        toggle();
                        window.location.reload();
                    } else {
                        alert("The user does not exist.");
                    }
                });
        }
    };

    const loginOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        Person.LoginName = event.target.value;
    };
    const passwordOnChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        Person.Password = event.target.value;
    };

    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    return (
        <div className="LoginScreen">
            <Button color="light" onClick={toggle}>
                Login
      </Button>
            <Link to="/Register">
                <Button color="light" className="RegisterBTN">
                    Register
        </Button>
            </Link>
            <Modal isOpen={modal} toggle={toggle} className="Modal">
                <ModalHeader toggle={toggle}>Login</ModalHeader>
                <ModalBody>
                    <Label for="LoginINPUT">Login</Label>
                    <Input
                        type="text"
                        onChange={loginOnChangeHandler}
                        name="Login"
                        id="LoginINPUT"
                        placeholder="Input login"
                    ></Input>
                    <Label for="PasswordINPUT">Password</Label>
                    <Input
                        type="password"
                        onChange={passwordOnChangeHandler}
                        name="password"
                        id="PasswordINPUT"
                        placeholder="Input password"
                    ></Input>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={Login}>
                        Login
          </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
          </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};