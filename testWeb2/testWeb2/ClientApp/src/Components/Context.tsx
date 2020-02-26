import React from "react";
import { Button } from "reactstrap";
import CodeServices from "../Services/CodeServices";

interface state {
  CodeResult: string;
  text: string;
  connectionString: string;
  Context: string;
}
interface props {
  ProjName: string;
}

export class ContextInput extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      CodeResult: "",
      text: "",
      connectionString: "",
      Context: ""
    };
  }

  btnOnClickModelGenerate = () => {
    //Отправка названия контекста и вызов генерации модели
    let ConectionData = {
      ConnectionString: this.state.connectionString,
      ContextName: this.state.Context,
      ProjName: this.props.ProjName
    };
    if (
      this.state.connectionString.length > 0 &&
      this.state.Context.length > 0
    ) {
      CodeServices.ModelGenerateService(ConectionData).then((Response: any) => {
        if (Response.status === 401) {
          console.log(Response.CodeResult);

          alert(
            "To use context generate or connect to the database, please register."
          );
        }
      });
    } else alert("Строка подключения не может быть пустой");
  };
  inptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ connectionString: event.target.value });
  };

  inptContextOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ Context: event.target.value });
  };

  render() {
    return (
      <div className="ConnectionConteiner">
        <input
          className="connectionComponent"
          onChange={this.inptOnChange}
          type="text"
          placeholder="input connection string"
        />
        <br />
        <input
          className="connectionComponentContext"
          type="text"
          placeholder="input context name"
          onChange={this.inptContextOnChange}
        />
        <Button
          className="connect ionComponentBTN"
          color="success"
          onClick={this.btnOnClickModelGenerate}
        >
          Generate Models
        </Button>
      </div>
    );
  }
}
