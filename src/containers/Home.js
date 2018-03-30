import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";
import "./Home.css";

import BankAccountInfo from "../components/BankAccountInfo";
import BrokerageCredentials from "../components/BrokerageCredentials";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Cake</h1>
                <p>A simple $$$ making app. Login or signup to view your dashboard.</p>
            </div>
        );
    }

    renderAuthedHome() {
        return (
            <div className="main">
                <PageHeader>Your Dashboard</PageHeader>
                <BankAccountInfo />
                <BrokerageCredentials />
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderAuthedHome() : this.renderLander()}
            </div>
        );
    }
}
