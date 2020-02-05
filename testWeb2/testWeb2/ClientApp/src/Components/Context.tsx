import React from "react";
import { Button } from "reactstrap";


interface state {
  CodeResult: string;
  text: string;
  connectionString: string;
  Context: string;
}

export class ContextInput extends React.Component<{}, state> {
  constructor(props: state) {
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
      ContextName: this.state.Context
    };
    if (
      this.state.connectionString.length > 0 &&
      this.state.Context.length > 0
    ) {
      fetch("SampleData/ModelGenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(ConectionData)
      })
        .then(Response => Response.json())
        .then(data =>
          this.setState({
            CodeResult: data
          })
        );
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
          className="connectionComponentBTN"
          color="success"
          onClick={this.btnOnClickModelGenerate}
        >
          Generate Models
        </Button>
      </div>
    );
  }
}
