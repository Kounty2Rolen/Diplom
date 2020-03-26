import sha256 from "crypto-js/sha256";
import React from "react";
import { Button, Input, Label } from "reactstrap";
import GetInfo from "../../Services/AccountServicesGetInfo";
import "./Register.css";

interface state {
  style: object;
  message: string;
  Person: {
    Fname: string;
    Mname: string;
    LoginName: string;
    Password: string;
  };
}
export class RegScreen extends React.Component<{}, state> {
  constructor(props: state) {
    super(props);
    this.state = {
      style: {},
      message: "",
      Person: {
        Fname: "",
        Mname: "",
        LoginName: "",
        Password: ""
      }
    };
  }

  public fnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.Person.Fname = event.target.value;
  };
  public mnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.Person.Mname = event.target.value;
  };
  public loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let regexp = /[.,=\-№\\ ?"':;!@#$%^&*()_+|\/{}]/gi;
    let value = event.target.value;
    if (value.matchAll(regexp)) {
      value = value.replace(/^\s/, "");
      value = value.replace(/  /, " ");
      value = value.replace(regexp, "");
      value = value.substr(0, 25);
    }
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      newState.Person.LoginName = value;
      return newState;
    });
  };
  public passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    let regexp = /[.,=\-№\\ ?"':;!@#$%^&*()_+|\/{}]/gi;
    let value = event.target.value;
    if (value.matchAll(regexp)) {
      value = value.replace(/^\s/, "");
      value = value.replace(/  /, " ");
      value = value.replace(regexp, "");
      value = value.substr(0, 25);
    }
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      newState.Person.Password = value;
      return newState;
    });
  };
  public Register = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (
      this.state.Person.LoginName !== "" &&
      this.state.Person.Password !== ""
    ) {
      this.state.Person.Password = sha256(
        this.state.Person.Password
      ).toString();

      GetInfo.Register(this.state.Person).then((data: any) =>
        this.setState({ message: data })
      );
    } else {
      this.setState({ message: "Check Fields!" });
      this.setState({ style: { border: "2px solid red" } });
    }
  };
  public logininputclick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.setState({ style: { border: "" } });
    this.setState({ message: "" });
  };
  public render() {
    return (
      <div className="Register">
        <div className="regBlocks">
          <Label>FName</Label>
          <Input onChange={this.fnameChange}></Input>
          <Label>MName</Label>
          <Input onChange={this.mnameChange}></Input>
          <Label>Login*</Label>
          <Input
            onChange={this.loginChange}
            style={this.state.style}
            onClick={this.logininputclick}
            value={this.state.Person.LoginName}
          ></Input>
          <Label>Password*</Label>
          <Input
            onChange={this.passwordChange}
            style={this.state.style}
            value={this.state.Person.Password}
            type="password"
          ></Input>
        </div>
        <code className="message">{this.state.message}</code>
        <br />
        <code>What is marked with an asterisk is a required field!</code>
        <br />
        <Button color="success" className="smbBTN" onClick={this.Register}>
          Submit
        </Button>
      </div>
    );
  }
}
