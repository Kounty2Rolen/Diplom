import React from 'react';
import { render } from '@testing-library/react';
import { About } from './About'
import { Home } from './Home';

interface props{
    currentPage: string
}
export class Main extends React.Component<props> {
    render(){
        switch (this.props.currentPage) {
            case 'home':
                return (<Home/>)
                break;
            case 'about':
                return (<About/>)
                break;
        
            default:
                break;
        }
    }
}