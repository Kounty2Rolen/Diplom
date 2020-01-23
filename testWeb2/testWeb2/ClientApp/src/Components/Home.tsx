import React from 'react';

interface state {
    currentCount: string


}

export class Home extends React.Component<{}, state>{


    text: string = "";
    connectionString: string = "";
    constructor(props: any) {
        super(props);
        this.state = { currentCount: "" };
    }

    btnOnClickModelGenerate = () => { //Отправка названия контекста и вызов генерации модели
        let element = (document.getElementById("inputContextName") as HTMLInputElement).value;
        console.log(this.connectionString.length +""+element.length );
        if (this.connectionString.length > 0 && element.length > 0) {
            fetch('SampleData/generateModel',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ConnectionString: this.connectionString, ContextName: element })
                })
                .then(Response =>
                    Response.json())
                .then(data => this.setState({
                    currentCount: data
                }));


        }
        else
            alert("Строка подключения не может быть пустой");

    }

    incrementCounter = () => {
        if (this.text.length >= 0) {//отправка данных в index()
            fetch('SampleData',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ text: this.text })
                })
                .then(Response =>
                    Response.json())
                .then(data => this.setState({
                    currentCount: data
                }));
        }
        else if (this.connectionString.length > 0) {
            alert('Сперва подключитесь к бд');
        } else
            alert('Поле с кодом не может быть пустым!');
    }

    btnClick = () => { //Отправка строки подключения
        console.log(this.connectionString.length);
        if (this.connectionString.length > 0) {
            fetch('SampleData/connection',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: this.connectionString })
                })
                .then(Response =>
                    Response.json())
                .then(data => this.setState({
                    currentCount: data
                }));


        }
        else
            alert("Строка подключения не может быть пустой");

    }
    inptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.connectionString = event.target.value;
    }
    txtAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.text = event.target.value;
    }

    render() {
        console.log(this.state.currentCount)
        return (

            <div>
                <br />
                <br />
                <div id="conString">
                    <input id="ConnectionStringInput" size={100} onChange={this.inptOnChange} type="text" placeholder="input connection string" />
                    <button onClick={this.btnClick}>Connect</button><br />
                    <input id="inputContextName" type="text" placeholder="input context name" /><br />
                    <button id="btnGenerate" onClick={this.btnOnClickModelGenerate} >Generate Models</button>
                </div>
                <br />
                <br />
                <textarea rows={20} cols={70} onChange={this.txtAreaOnChange} placeholder="input yours code" ></textarea>
                <textarea rows={20} cols={70} value={this.state.currentCount} placeholder="result" ></textarea>
                <br />
                <button onClick={this.incrementCounter}>Submit</button>
            </div>

        );
    }
}




