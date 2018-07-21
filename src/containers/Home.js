import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./Home.css";

import Dashboard from "../components/Dashboard";

export default class Home extends Component {
    renderLander() {
        return <Redirect to="/login" />;
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
