import React from 'react';
import { Col, Glyphicon, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import './ESPPDetails.css';
import '../AccountSetup/StepsTooltip.css';

const createDetailsTooltip = (tooltipText) => {
    return (
        <OverlayTrigger
            placement='right'
            overlay={
                <Tooltip className='steps-tooltip'>
                    { tooltipText }
                </Tooltip>
            }
        >
            <Glyphicon glyph='question-sign' />
        </OverlayTrigger>
    );
};

export const ESPPDetails = ({
    salary,
    currentPaycheckAmount,
    payPeriod,
    lastPaycheck,
    company,
    companyDiscount,
    lookback,
    enrollmentPeriod,
    maxAllowableContribution,
    eSPPNotes,
    policyLink,
}) => {
    return (
        <Row className='espp-details dashboard-data-container'>
            <Col xs={6} className='border-right'>
                <h3>Your ESPP: <span className='right'>{ company }</span></h3>
                <br />
                Discount: { createDetailsTooltip('SOME TEXT') } <strong>{ companyDiscount }</strong>
                <br />
                <br />
                Lookback: { createDetailsTooltip('SOME TEXT') } <strong>{ lookback }</strong>
                <br />
                <br />
                Enrollment Period Length: { createDetailsTooltip('SOME TEXT') } <strong>{ enrollmentPeriod }</strong>
                <br />
                <br />
                Max Allowable Annual Contribution: { createDetailsTooltip('SOME TEXT') } <strong>{ maxAllowableContribution }</strong>
                <div className='center-text bottom-notes'>
                    <small>
                        <i>{eSPPNotes}</i>
                        <br />
                        <a rel="noopener noreferrer" target="_blank" href={policyLink}>
                            READ FULL DETAILS OF {company.toUpperCase()} POLICY HERE
                        </a>
                    </small>
                </div>
            </Col>
            <Col xs={6}>
            </Col>
        </Row>
    );
};

export const ESPPDetailsDefault = () => {
    return null;
};