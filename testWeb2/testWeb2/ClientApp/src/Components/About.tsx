import React from 'react'
import { render } from '@testing-library/react'
import { ReactComponent } from '*.svg'
import './About.css'


export class About extends React.Component<{}>{
    constructor(props: any) {
        super(props);
    }


    render() {
        return (
            
            <div className="AboutUs">
                
                <h3>KEEP KALM AND CODING</h3>

            </div>

        );

    }
}
