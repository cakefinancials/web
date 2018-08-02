import React from 'react';
import { Row } from 'react-bootstrap';
import * as R from 'ramda';

import './EstimatedCakeEarnings.css';

const formatDollars = (dollars) => `$${(dollars).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

const ENROLLMENT_PERIOD_DIVISORS = {
    '1 Months': 12,
    '2 Months': 6,
    '3 Months': 4,
    '6 Months': 2,
    '12 Months': 1,
};

export const EstimatedCakeEarnings = ({ estimated2017Earnings, purchasePeriod }) => {
    if (R.isNil(estimated2017Earnings) || estimated2017Earnings === '0') {
        return null;
    }

    console.log(purchasePeriod);
    const parsedEstimated2017Earnings = parseFloat(estimated2017Earnings);
    const estimated2017EarningsDollars = formatDollars(parsedEstimated2017Earnings);

    const cakePayout = parsedEstimated2017Earnings / (ENROLLMENT_PERIOD_DIVISORS[purchasePeriod] || 1);
    const cakePayoutsDollars = formatDollars(cakePayout);

    return (
        <Row className='estimated-cake-earnings dashboard-data-container centered-text'>
            <h2>CAKE ESTIMATED EARNINGS</h2>
            <div className='text'> Last year you would have made: </div>
            <div className='yearly-earnings'>{ estimated2017EarningsDollars }</div>
            <div className='text'>, for an average Cake payout of <span className='cake-payouts'>{ cakePayoutsDollars }</span></div>
            <br />
            <br />
        </Row>
    );
};

export const EstimatedCakeEarningsDefault = () => {
    return (
        <Row className='estimated-cake-earnings dashboard-data-container centered-text'>
            <br />
            <div>
                Last year an Intuit employee making $100,000 would have made:
            </div>
            <br />
            <div>
                <div className='yearly-earnings'>$2,051</div>
            </div>
            <br />
            <div>
                And received an average quarterly Cake check for <span className='cake-payouts'>$512.75</span>
            </div>
            <br />
        </Row>
    );
};