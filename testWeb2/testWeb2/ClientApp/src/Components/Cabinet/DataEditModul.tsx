import React from "react";
import { Button, Label, Input } from "reactstrap";
import { ContextInput } from "../Context";
import { Link, Redirect } from "react-router-dom";
import sha256 from "crypto-js/sha256";
import GetInfo  from "../../Services/AccountServicesGetInfo";


interface state {
    OldPassword: string;
    NewPassword: string;
    projects: string[];
    Person:{
      fname: string;
      mname: string;
      loginName: string;
    };
  }
export class DataEditModul extends React.Component<{},state> {
    constructor(props: state) {
        super(props);
        this.state = {
          OldPassword: "",
          NewPassword: "",
          projects: [],
          Person: {
            fname: "",
            mname: "",
            loginName: ""
          }
        };
      }
      init() {
       GetInfo.getInfo().then((data:any)=>this.setState({Person:data},));

   
     }
      componentDidMount() {
        this.init();
      }
      
  onChangeOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ OldPassword: event.target.value });
  };

  onChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ NewPassword: event.target.value });
  };

  buttonOnClickChangePassword = () => {
    let Passwords = {
      NewPassword: "",
      OldPassword: ""
    };
    Passwords.OldPassword = sha256(this.state.OldPassword).toString();
    Passwords.NewPassword = sha256(this.state.NewPassword).toString();

    fetch("AccountEdit/EditPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: JSON.stringify(Passwords)
    })
  };




  render() {
    return (
      <div className="dataEditModul">
        <h2>Edit Profile</h2>
        <div className="FieldsModul">
          <div className="Fields">
            <Label className="Label">FName</Label>
            <Input
              className="Input inputFname"
              value={this.state.Person.fname}
            ></Input>
            <Label className="Label">MName</Label>
            <Input
              className="Input inputMname"
              defaultValue={this.state.Person.mname}
            ></Input>
          </div>
          <Button color="success" className="btn">
            Confirm
          </Button>
          <div className="Fields">
            <Label className="Label">Old password</Label>
            <Input
              className="Input inputOldPass"
              onChange={this.onChangeOldPassword}
              type="password"
            ></Input>
            <Label className="Label">New password</Label>
            <Input
              className="Input inputNewPass"
              onChange={this.onChangeNewPassword}
              type="password"
            ></Input>
          </div>
          <Button
            onClick={this.buttonOnClickChangePassword}
            color="success"
            className="btn"
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }
}
