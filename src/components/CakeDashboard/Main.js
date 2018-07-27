import React, { Component, Fragment } from 'react';
import { Alert } from 'react-bootstrap';

import { EstimatedCakeEarnings, EstimatedCakeEarningsDefault } from './EstimatedCakeEarnings';
import LoadingSpinner from '../LoadingSpinner';
import TickerChart from './TickerChart';
import { ESPPDetails } from './ESPPDetails';

import './Main.css';

import { subscribeUserDashboardDataChange } from '../../libs/userState';

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingUserDashboardData: true,
            userDashboardData: null,
            errorLoadingDashboardData: false
        };
    }

    async componentDidMount() {
        this.unsubscribeUserDashboardData = subscribeUserDashboardDataChange(({ userDashboardData, loading, error }) => {
            this.setState({ userDashboardData, isLoadingUserDashboardData: loading, errorLoadingDashboardData: error });
        });
    }

    componentWillUnmount() {
        if (this.unsubscribeUserDashboardData) {
            this.unsubscribeUserDashboardData();
        }
    }

    renderInitialLoading = () => {
        return (
            <LoadingSpinner bsSize='large' text='Loading your dashboard...' />
        );
    }

    renderDataMissingDashboard() {
        return (
            <Fragment>
                <div className='center-text'>
                    <div className='purple-cake-text'>
                        <big>Welcome to your Cake dashboard! All of your data will populate after your analyst has reviewed your account details.</big>
                    </div>
                    <EstimatedCakeEarningsDefault />
                </div>
                <div className='dashboard-spacing' />
                <TickerChart stockTicker={null} />
            </Fragment>
        );
    }

    renderMainDashboard() {
        if (this.state.errorLoadingDashboardData) {
            return (
                <Alert bsStyle='danger' className='center-text'>
                    <strong>There was an issue loading the page! Please try again in a bit, or contact us for support</strong>
                </Alert>
            );
        }

        const { userDashboardData } = this.state;

        if (userDashboardData === null || userDashboardData.company === '') {
            return this.renderDataMissingDashboard();
        }

        return (
            <Fragment>
                <EstimatedCakeEarnings
                    estimated2017Earnings={userDashboardData['estimated 2017 earnings']}
                    enrollmentPeriod={userDashboardData['Enrollment Period']}
                />
                <div className='dashboard-spacing' />
                <TickerChart stockTicker={userDashboardData['Stock Ticker']} />
                <div className='dashboard-spacing' />
                <ESPPDetails
                    salary={userDashboardData['salary']}
                    currentPaycheckAmount={userDashboardData['current paycheck amount']}
                    payPeriod={userDashboardData['pay period']}
                    lastPaycheck={userDashboardData['last paycheck']}
                    company={userDashboardData['company']}
                    companyDiscount={userDashboardData['Company Discount']}
                    lookback={userDashboardData['Lookback']}
                    enrollmentPeriod={userDashboardData['Enrollment Period']}
                    maxAllowableContribution={userDashboardData['Max Allowable Contribution']}
                    eSPPNotes={userDashboardData['ESPP Notes']}
                    policyLink={userDashboardData['Policy Link']}
                />
            </Fragment>
        );
    }

    getRenderBody() {
        if (this.state.isLoadingUserDashboardData) {
            return this.renderInitialLoading();
        } else {
            return this.renderMainDashboard();
        }
    }

    render() {
        return (
            <div className='cake-dashboard-main'>
                { this.getRenderBody() }
            </div>
        );
    }
}