import React from "react";
import "../Home.css";
import { Result } from "./ResultCode";
import { Button, Row, Col, Spinner } from "reactstrap";
import ReactCodeMirror from "react-codemirror";
import CodeMirror from "codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import CodeService from "../../Services/CodeServices";
import { Spin } from "./Spinner";

interface state {
  Result: {
    resultcode: string;
    sql: string;
  };
  SourceCode: string;
  connectionString: string;
  Context: string;
  Spin: boolean;
}

export class InpCode extends React.Component<{}, state> {
  constructor(porps: state) {
    super(porps);
    this.state = {
      Result: {
        resultcode: "",
        sql: ""
      },
      SourceCode: "",
      connectionString: "",
      Context: "",
      Spin: false
    };
    this.setSpinnerStatus = this.setSpinnerStatus.bind(this);
  }
  componentDidMount() {
    this.setState({
      SourceCode: "return \"Hello World\";/*Return only string*/"
    });
  }
  codeCompile = () => {
    debugger;
    this.setSpinnerStatus().then(() => {
      let Code: object;
      if (sessionStorage.getItem("Token") !== null) {
        Code = {
          SourceCode: this.state.SourceCode,
          ContextName: document.getElementsByClassName(
            "connectionComponentContext"
          )[0].nodeValue
            ? document.getElementsByClassName("connectionComponentContext")[0]
                .nodeValue
            : "Context"
        };
      } else {
        Code = {
          SourceCode: this.state.SourceCode
        };
      }
      if (this.state.SourceCode.length >= 0) {
        //отправка данных в index() генерация и выполнение кода
        CodeService.SendCode(Code).then((data: any) => {
          console.log(data);

          this.setState({
            Result: data
          });
        });
        console.log(this.state.Result);
      } else if (this.state.connectionString.length > 0) {
        alert("Сперва подключитесь к бд");
      } else alert("Поле с кодом не может быть пустым!");
      this.setSpinnerStatus();
    });
  };
  setSpinnerStatus = () => {
    this.setState({
      Spin: !this.state.Spin
    });
    return new Promise((result, error) => {
      result();
    });
  };
  txtAreaOnChange = (event: any) => {
    this.setState({ SourceCode: event });
  };

  render() {
    console.log(this.state.Spin);
    let options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp",
    };
    return (
      <div>
        <ReactCodeMirror
          onChange={this.txtAreaOnChange}
          className="InputCode"
          options={options}
        ></ReactCodeMirror>
        {/* <textarea
          className="txtArea"
          id="SourceCode"
          rows={20}
          cols={70}
          onChange={this.txtAreaOnChange}
          placeholder="input yours code"
        ></textarea> */}

        <Result Result={this.state.Result} />
        <br />
        {this.state.Spin ? <Spinner color="primary"></Spinner> : null}
        <Button
          className="btnConnect"
          color="danger"
          onClick={this.codeCompile}
        >
          Submit
        </Button>
      </div>
    );
  }
}
