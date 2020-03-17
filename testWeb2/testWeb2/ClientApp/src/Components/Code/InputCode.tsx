import React from "react";
import ReactCodeMirror from "react-codemirror";
import { Button, Spinner } from "reactstrap";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import CodeService from "../../Services/CodeServices";
import "../Home.css";
import { Result } from "./ResultCode";
import * as SignalR from "@aspnet/signalr";

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
        resultcode: "Result:\n",
        sql: "SQL:\n"
      },
      SourceCode: "",
      connectionString: "",
      Context: "",
      Spin: false
    };
  }
  hub = new SignalR.HubConnectionBuilder().withUrl("/rtt").build();

  componentDidMount() {
    this.hub.on("Result", (data: string) => {
      if (data === "True") {
        this.setState({ Spin: false });
      } else {
        this.setState(prevState => ({
          Result: {
            resultcode: this.state.Result.resultcode + data,
            sql: this.state.Result.sql
          }
        }));
        console.log(data);
      }
    });
    this.hub.on("Exception", (data: string) => {
      this.setState(prevState => ({
        Result: {
          resultcode: "Compilation Error:\n" + data,
          sql: this.state.Result.sql
        }
      }));
    });

    this.hub.on("SQL", (data: string) => {
      this.setState(prevState => ({
        Result: {
          resultcode: this.state.Result.resultcode,
          sql: this.state.Result.sql + data
        }
      }));

      console.log(this.state.Result);
    });
    this.hub.start();
  }
  public codeCompile = () => {
    if (localStorage.getItem("Object") === null) {
      alert("Нет скомпилированной модели базы данных!");
    } else {
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
            : "Context",
          serializeAnonProj: localStorage.getItem("Object")
        };
        debugger;
      } else {
        Code = {
          SourceCode: this.state.SourceCode,
          serializeAnonProj: localStorage.getItem("Object")
        };
      }
      if (this.state.SourceCode.length >= 0) {
        this.hub.send("Result", JSON.stringify(Code));

      } else if (this.state.connectionString.length > 0) {
        alert("Сперва подключитесь к бд");
      } else {
        alert("Поле с кодом не может быть пустым!");
      }
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
