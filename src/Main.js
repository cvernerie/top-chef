import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import Home from "./Home";
import Starred from "./Starred";

class Main extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1>Deals from lafourchette.com</h1>
                    <ul className="header">
                        <li><NavLink to="/">Deals</NavLink></li>
                        <li><NavLink to="/starred-restaurants">Starred restaurants</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/starred-restaurants" component={Starred}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;
