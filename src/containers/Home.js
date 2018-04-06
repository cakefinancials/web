import React, { Component } from "react";
import { Grid, PageHeader } from "react-bootstrap";
import "./Home.css";

import BankAccountInfo from "../components/BankAccountInfo";
import BrokerageCredentials from "../components/BrokerageCredentials";

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
        return (
            <Grid className="main">
                <PageHeader>Your Dashboard</PageHeader>
                <BankAccountInfo />
                <BrokerageCredentials />
            </Grid>
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
