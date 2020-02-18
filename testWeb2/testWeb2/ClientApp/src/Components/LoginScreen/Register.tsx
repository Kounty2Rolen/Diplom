import React from "react";
import { Label, Input, Button } from "reactstrap";
import "./Register.css";
import sha256 from "crypto-js/sha256";
import GetInfo from "../../Services/AccountServicesGetInfo"

interface state {
    style: object;
    message: string;
}
export class RegScreen extends React.Component<{}, state> {
    constructor(props: state) {
        super(props);
        this.state = { style: {}, message: "" };
    }

    Person = {
        Fname: "",
        Mname: "",
        LoginName: "",
        Password: ""
    };

    fnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.Fname = event.target.value;
    };
    mnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.Mname = event.target.value;
    };
    loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.LoginName = event.target.value;
    };
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.Password = event.target.value;
    };
    Register = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (this.Person.LoginName !== "" && this.Person.Password !== "") {
            this.Person.Password = sha256(this.Person.Password).toString();
            
                GetInfo.Register(this.Person).then((data:any) => this.setState({ message: data }));
        } else {
            this.setState({ message: "Check Fields!" });
            this.setState({ style: { border: "2px solid red" } });
        }
    };
    logininputclick = (event: React.MouseEvent<HTMLInputElement>) => {
        this.setState({ style: { border: "" } });
        this.setState({ message: "" });
    };
    render() {
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
                    ></Input>
                    <Label>Password*</Label>
                    <Input
                        onChange={this.passwordChange}
                        style={this.state.style}
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