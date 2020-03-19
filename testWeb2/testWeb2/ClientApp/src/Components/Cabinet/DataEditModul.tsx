import sha256 from "crypto-js/sha256";
import React from "react";
import { Button, Input, Label } from "reactstrap";
import GetInfo from "../../Services/AccountServicesGetInfo";

interface state {
  OldPassword: string;
  NewPassword: string;
  projects: string[];
  Person: {
    fname: string;
    mname: string;
    loginName: string;
  };
}

export class DataEditModul extends React.Component<{}, state> {
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
  public init() {
    GetInfo.getInfo().then((data: any) => this.setState({ Person: data }));
  }
  public componentDidMount() {
    this.init();
  }

  public onChangeOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ OldPassword: event.target.value });
  };

  public onChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ NewPassword: event.target.value });
  };

  public buttonOnClickChangePassword = () => {
    const Passwords = {
      NewPassword: "",
      OldPassword: ""
    };
    Passwords.OldPassword = sha256(this.state.OldPassword).toString();
    Passwords.NewPassword = sha256(this.state.NewPassword).toString();

    GetInfo.PasswordEdit(Passwords).then((Response: any) => {
      if (Response.ok) {
        alert("Sucscess");
      } else {
        alert("Error");
      }
    });
  };
  public fnameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      Person: {
        fname: e.target.value,
        mname: this.state.Person.mname,
        loginName: ""
      }
    });
  };
  public mnameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      Person: {
        fname: this.state.Person.fname,
        mname: e.target.value,
        loginName: ""
      }
    });
  };
  public fioChange = () => {
    GetInfo.FioChange(this.state.Person);
    alert("Sucscess");
    window.location.reload();
  };
  public render() {
    return (
      <div className="dataEditModul">
        <h2>Edit Profile</h2>
        <div className="FieldsModul">
          <div className="Fields">
            <Label className="Label">FName</Label>
            <Input
              className="Input inputFname"
              value={this.state.Person.fname}
              onChange={this.fnameOnChange}
            ></Input>
            <Label className="Label">MName</Label>
            <Input
              className="Input inputMname"
              defaultValue={this.state.Person.mname}
              onChange={this.mnameOnChange}
            ></Input>
          </div>
          <Button color="success" className="btn" onClick={this.fioChange}>
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
