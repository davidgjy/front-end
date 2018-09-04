import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = ({ children }) => {
    return (
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">TodoCard</span>
                    <div className="mdl-layout-spacer"/>
                    <nav className="mdl-navigation mdl-layout--large-screen-only">
                        <a className="mdl-navigation__link" href="">Home</a>
                        <a className="mdl-navigation__link" href="">About</a>
                    </nav>
                </div>
            </header>
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">Drawer</span>
                <nav className="mdl-navigation">
                    <a className="mdl-navigation__link" href="">Home</a>
                    <a className="mdl-navigation__link" href="">About</a>
                </nav>
            </div>
            <main className="mdl-layout__content">
                {children}
            </main>
        </div>
    );
};

export default Header;