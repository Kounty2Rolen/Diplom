import React from 'react';
import './Home.css'
import { Button, ButtonGroup } from 'reactstrap'
import { stringify } from 'querystring';
import { InpCode } from './Code/InputCode'
import { ContextInput } from './Context'


export class Home extends React.Component {
    render() {
        return (

            <div>

                <br />
                <br />

                <ContextInput />
                <br />
                <InpCode />
            </div>

        );
    }
}




