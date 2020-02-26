import React from "react";
import "../Home.css";
import { Result } from "./ResultCode";
import { Button, Row, Col } from "reactstrap";
import ReactCodeMirror from "react-codemirror";
import CodeMirror from "codemirror";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import CodeService from "../../Services/CodeServices";

interface state {
  CodeResult: string;
  SourceCode: string;
  connectionString: string;
  Context: string;
}

export class InpCode extends React.Component<{}, state> {
  constructor(porps: state) {
    super(porps);
    this.state = {
      CodeResult: "",
      SourceCode: "",
      connectionString: "",
      Context: ""
    };
  }
  componentDidMount() {
    // CodeMirror.signal(document.getElementsByClassName("InputCode")[0],"change")
  }
  codeCompile = () => {
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
      CodeService.SendCode(Code).then((data: any) =>
        this.setState({
          CodeResult: data
        })
      );
    } else if (this.state.connectionString.length > 0) {
      alert("Сперва подключитесь к бд");
    } else alert("Поле с кодом не может быть пустым!");
  };
  txtAreaOnChange = (event: any) => {
    this.setState({ SourceCode: event });
  };

  render() {
    let options = {
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

        <Result codeResult={this.state.CodeResult} />
        <br />
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
