import sha256 from "crypto-js/sha256";
import React from "react";
import { Button, Input, Label } from "reactstrap";
import GetInfo from "../../Services/AccountServicesGetInfo";
import "./Register.css";

interface state {
    style: object;
    message: string;
}
export class RegScreen extends React.Component<{}, state> {

    public Person = {
        Fname: "",
        Mname: "",
        LoginName: "",
        Password: "",
    };
    constructor(props: state) {
        super(props);
        this.state = { style: {}, message: "" };
    }

    public fnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.Fname = event.target.value;
    }
    public mnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.Mname = event.target.value;
    }
    public loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.LoginName = event.target.value;
    }
    public passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.Person.Password = event.target.value;
    }
    public Register = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (this.Person.LoginName !== "" && this.Person.Password !== "") {
            this.Person.Password = sha256(this.Person.Password).toString();

            GetInfo.Register(this.Person).then((data: any) => this.setState({ message: data }));
        } else {
            this.setState({ message: "Check Fields!" });
            this.setState({ style: { border: "2px solid red" } });
        }
    }
    public logininputclick = (event: React.MouseEvent<HTMLInputElement>) => {
        this.setState({ style: { border: "" } });
        this.setState({ message: "" });
    }
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
