import React from "react";
import { Button, Spinner } from "reactstrap";
import { serialize } from "v8";
import CodeServices from "../Services/CodeServices";

interface state {
  CodeResult: string;
  text: string;
  connectionString: string;
  Context: string;
  spin: boolean;
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
      Context: "",
      spin: false
    };
  }

  public btnOnClickModelGenerate = () => {
    this.setState({ spin: true });
    // Отправка названия контекста и вызов генерации модели
    const ConectionData = {
      ConnectionString: this.state.connectionString,
      ContextName: this.state.Context,
      ProjName: this.props.ProjName
    };
    if (
      this.state.connectionString.length > 0 &&
      this.state.Context.length > 0
    ) {
      CodeServices.ModelGenerateService(ConectionData).then(
        (Response: string) => {
          this.setState({ spin: false });
          localStorage.setItem("AnonymObject", Response);
        }
      );
    } else {
      alert("Строка подключения не может быть пустой");
      this.setState({ spin: false });
    }
  };
  public inptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ connectionString: event.target.value });
  };

  public inptContextOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ Context: event.target.value });
  };

  public render() {
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
        {this.state.spin ? <Spinner color="success"></Spinner> : null}
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
