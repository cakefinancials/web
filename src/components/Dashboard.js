import React, { Component } from "react";
import { Grid, PageHeader } from "react-bootstrap";

import BankAccountInfo from "./BankAccountInfo";
import BrokerageCredentials from "./BrokerageCredentials";
import LoadingSpinner from "./LoadingSpinner";
import Walkthrough from "./AccountSetup/Walkthrough";

import { fetchUserState, subscribe, userStateActions } from "../libs/userState";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingUserState: true,
            syncErrors: [],
            syncing: false,
        };

        subscribe(userStateUpdates => {
            this.setState(userStateUpdates);
        });
    }

    async componentDidMount() {
        await fetchUserState();
        this.setState({ isLoadingUserState: false });
    }

    renderInitialLoading = () => {
        return (
            <LoadingSpinner bsSize="large" text="Picking up where we left off..." />
        );
    }

    renderSyncing = () => {
        return (
            <LoadingSpinner bsSize="large" text="Syncing with backend..." />
        );
    }

    renderCurrentDashboardStep() {
        const walkthroughStep = userStateActions.getWalkthroughStep();
        if (walkthroughStep !== WALKTHROUGH.DONE) {
            return (
                <div>
                    <h1>WALKTHROUGH!!!</h1>
                    <Walkthrough />
                </div>
            );
        };

        // default is main dash
        return (
            <div>
                <PageHeader>Your Dashboard</PageHeader>
                <BankAccountInfo />
                <BrokerageCredentials />
            </div>
        )
    }

    renderDashboard() {
        return (
            <Grid className="dashboard">
                { this.renderCurrentDashboardStep() }
            </Grid>
        );
    }

    getRenderBody() {
        if (this.state.isLoadingUserState) {
            return this.renderInitialLoading();
        } else if (this.state.syncing) {
            return this.renderSyncing();
        } else {
            return this.renderDashboard();
        }
    }

    render() {
        return (
            <div className="dashboard">
                { this.getRenderBody() }
            </div>
        );
    }
}