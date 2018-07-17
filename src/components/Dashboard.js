import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";

import BankAccountInfo from "./BankAccountInfo";
import BrokerageCredentials from "./BrokerageCredentials";
import LoadingSpinner from "./LoadingSpinner";
import Walkthrough from "./AccountSetup/Walkthrough";

import { fetchUserState, subscribeUserStateChange, userStateActions } from "../libs/userState";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingUserState: true,
            syncErrors: [],
            syncing: false,
        };

        subscribeUserStateChange(userStateUpdates => {
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
            return <Walkthrough />;
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

    getRenderBody() {
        if (this.state.isLoadingUserState) {
            return this.renderInitialLoading();
        } else if (this.state.syncing) {
            return this.renderSyncing();
        } else {
            return this.renderCurrentDashboardStep();
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