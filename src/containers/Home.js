import React, { Component } from "react";
import "./Home.css";

import Dashboard from "../components/Dashboard";

export default class Home extends Component {
    renderLander() {
        return (
            <div className="lander">
                <h1>Cake</h1>
                <p>A simple $$$ making app. Login or signup to view your dashboard.</p>
            </div>
        );
    }

    renderAuthedHome() {
        return ( <Dashboard /> );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderAuthedHome() : this.renderLander()}
            </div>
        );
    }
}
