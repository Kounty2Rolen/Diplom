import React, { useState } from "react";
import {
  Button,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import "./LoginScreen.css";
import { Link } from "react-router-dom";
import sha256 from "crypto-js/sha256";

export const LoginScreen = () => {
  let Person = {
    LoginName: "",
    Password: ""
  };
  const Login = () => {
    Person.Password = sha256(Person.Password).toString();
    if (Person.LoginName === "") {
      alert("Please check all fields, login and password not can be empty !");
    } else if (Person.LoginName !== "") {
      fetch("Account/Token", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(Person)
      })
        .then(Response => Response.text())
        .then(token => sessionStorage.setItem("Token", token))
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

  let loginOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    Person.LoginName = event.target.value;
  };
  let passwordOnChangeHandler = (
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
      <Button color="light" className="RegisterBTN">
        <Link to="/Register">Register</Link>
      </Button>
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
