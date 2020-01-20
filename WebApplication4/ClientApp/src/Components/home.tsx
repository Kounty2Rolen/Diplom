import React from 'react';

interface state {
    currentCount: string


}

export class Home extends React.Component<{}, state>{


    text: string = "";
    constructor(props: any) {
        super(props);
        this.state = { currentCount: "" };
    }

    incrementCounter = () => {
        if (this.text.length >= 0) {
            fetch('api/SampleData',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json','Accept':'application/json' },
                    body: JSON.stringify({ text: this.text })
                })
                .then(Response =>
                    Response.json())
                .then(data  => this.setState({
                    currentCount: data
                }));
                
        }
        else {

            alert('Поле с кодом не может быть пустым!');
        }
    }


    txtAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.text = event.target.value;

    }
    render() {
        console.log(this.state.currentCount)
        return (
            <div>
                <textarea onChange={this.txtAreaOnChange}></textarea>
                <textarea value={this.state.currentCount}></textarea>

                <button onClick={this.incrementCounter}>Submit</button>
            </div>
        );
    }
}




