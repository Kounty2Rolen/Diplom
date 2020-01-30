import React from 'react';
import './Home.css'
import { Button, ButtonGroup } from 'reactstrap'
import { stringify } from 'querystring';

interface state {
    CodeResult: string
    text: string
    connectionString: string
    Context: string
}

export class ContextInput extends React.Component<{}, state>{


    constructor(props: any) {
        super(props);
        this.state = { CodeResult: "", text: "", connectionString: "", Context: "" };
    }

    btnOnClickModelGenerate = () => { //Отправка названия контекста и вызов генерации модели
        let ConectionData = {
            ConnectionString: this.state.connectionString,
            ContextName: this.state.Context
        }
        if (this.state.connectionString.length > 0 && this.state.Context.length > 0) {
            fetch('SampleData/ModelGenerate',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(ConectionData)
                })
                .then(Response =>
                    Response.json())
                .then(data => this.setState({
                    CodeResult: data
                }));

        }
        else
            alert("Строка подключения не может быть пустой");

    }
    inptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({connectionString: event.target.value});
    }

    inptContextOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ Context: event.target.value });
    }

    render() {
        console.log(this.state.CodeResult)
        return (
            <div>
                <input className="connectionComponent" size={100} onChange={this.inptOnChange} type="text" placeholder="input connection string" />
                <br/>
                <input className="connectionComponent" type="text" placeholder="input context name" onChange={this.inptContextOnChange} />
                <Button className="connectionComponentBTN" color="danger" onClick={this.btnOnClickModelGenerate} >Generate Models</Button>
            </div>

        );
    }


}
