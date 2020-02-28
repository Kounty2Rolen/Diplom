import CodeMirror from "codemirror";
import React from "react";
import ReactCodeMirror from "react-codemirror";
import { Button, Col, Row, Spinner } from "reactstrap";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import CodeService from "../../Services/CodeServices";
import "../Home.css";
import { Result } from "./ResultCode";
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
  }

  public codeCompile = () => {
    let Code: object;
    this.setState({ Spin: true });
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
      debugger;
    } else {
      Code = {
        SourceCode: this.state.SourceCode,
        serializeAnonProj: localStorage.getItem("AnonymObject")
      };
    }
    if (this.state.SourceCode.length >= 0) {
      // отправка данных в index() генерация и выполнение кода
      CodeService.SendCode(Code).then((data: any) => {
        this.setState(
          {
            Result: data
          },
          () => {
            this.setState({ Spin: false });
          }
        );
      });
    } else if (this.state.connectionString.length > 0) {
      alert("Сперва подключитесь к бд");
    } else {
      alert("Поле с кодом не может быть пустым!");
    }
  };

  public txtAreaOnChange = (event: any) => {
    this.setState({ SourceCode: event });
  };
  public btnlock = () => {
    return this.state.Spin ? (
      <html>
        <Button
          size="lg"
          className="btnConnect"
          color="danger"
          onClick={this.codeCompile}
          disabled
        >
          Submit
        </Button>
      </html>
    ) : (
      <html>
        <Button
          size="lg"
          className="btnConnect"
          color="danger"
          onClick={this.codeCompile}
        >
          Submit
        </Button>
      </html>
    );
  };
  public render() {
    console.log(this.state.Spin);
    const options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csharp"
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
        {this.state.Spin ? <Spinner color="danger"></Spinner> : null}
        {this.btnlock()}
        {/* <Button
          size="lg"
          className="btnConnect"
          color="danger"
          onClick={this.codeCompile}
        >
          Submit
        </Button> */}
      </div>
    );
  }
}
