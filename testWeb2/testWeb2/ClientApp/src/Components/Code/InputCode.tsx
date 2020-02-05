import React from "react";
import "../Home.css";
import { Result } from "./ResultCode";
import { Button } from "reactstrap";

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
  codeCompile = () => {
    let Code = {
      SourceCode: this.state.SourceCode,
      ContextName: this.state.Context
    };
    if (this.state.SourceCode.length >= 0) {
      //отправка данных в index() генерация и выполнение кода
      fetch("SampleData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(Code)
      })
        .then(Response => Response.json())
        .then(data =>
          this.setState({
            CodeResult: data
          })
        );
    } else if (this.state.connectionString.length > 0) {
      alert("Сперва подключитесь к бд");
    } else alert("Поле с кодом не может быть пустым!");
  };
  txtAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ SourceCode: event.target.value });
  };
  render() {
    return (
      <div>
        <textarea
          className="txtArea"
          rows={20}
          cols={70}
          onChange={this.txtAreaOnChange}
          placeholder="input yours code"
        ></textarea>
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
