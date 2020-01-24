import React from 'react';
import { render } from '@testing-library/react';
import { About } from './About'
import { Home } from './Home';

export class Menu extends React.Component<{}>{
 
    render() {
        return (
            <div >
                <header >
                    <nav>
                        <a>Home</a>
                        <a>About</a>
                        <a>Blog</a>
                        <a>Portefolio</a>
                        <a>Contact</a>
                        <div className="animation start-home"></div>
                    </nav>
                </header>

            </div>

        );
    }

}

