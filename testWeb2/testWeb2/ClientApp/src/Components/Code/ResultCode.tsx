import React, { Props } from 'react';
import '../Home.css'
import { Button, ButtonGroup } from 'reactstrap'
import { stringify } from 'querystring';



interface props {
    codeResult: string
}

export class Result extends React.Component<props>{




    constructor(props: any) {
        super(props);
    }


    render() {
        return (

                <textarea className="txtArea" rows={20} cols={70} value={this.props.codeResult} placeholder="result" ></textarea>
        );
    }
}




