import React, { Component } from 'react';
import { Col, Glyphicon, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import axios from 'axios';

import { ObfuscatedBankAccountInfo, BankAccountInfoEditor } from '../BankAccountInfo';
import { ObfuscatedBrokerageCredentials, BrokerageCredentialsEditor } from '../BrokerageCredentials';
import CakeButton from '../helpers/CakeButton';
import { subscribeSessionChange } from '../../libs/userState';

import cakeImageSrc from '../../public/app/cake.png';

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

export class ESPPDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditPersonalDetailsModal: false,
            showEditFinancialDetailsModal: false,
            email: null
        };
    }

    componentDidMount() {
        this.unsubscribeSessionChange = subscribeSessionChange((session) => {
            const email = session.idToken.payload.email;
            this.setState({ email });
        });
    }

    componentWillUnmount() {
        if (this.unsubscribeSessionChange) {
            this.unsubscribeSessionChange();
        }
    }

    handleCloseEditPersonalDetailsModal() {
        this.setState({ showEditPersonalDetailsModal: false });
    }

    handleShowEditPersonalDetailsModal() {
        this.setState({ showEditPersonalDetailsModal: true });
    }

    handleCloseEditFinancialDetailsModal() {
        this.setState({ showEditFinancialDetailsModal: false });
    }

    handleShowEditFinancialDetailsModal() {
        this.setState({ showEditFinancialDetailsModal: true });
    }

    renderEditPersonalDetailsModal() {
        return (
            <Modal
                bsSize='large'
                className='espp-details-modal'
                show={this.state.showEditPersonalDetailsModal}
                onHide={() => this.handleCloseEditPersonalDetailsModal()}
            >
                <Modal.Header
                    className='espp-details-modal-header'
                    closeButton
                />
                <Modal.Body>
                    <Row>
                        <Col xs={12} className='personal-details-modal-text-content'>
                            <p><strong>Did your compensation change?</strong></p>

                            <p>
                                If so, your analyst will verify this via your brokerage account
                                and update your details accordingly. We need to verify this manually,
                                as a compensation change may trigger an adjustment to the Cake paperwork.
                            </p>
                        </Col>
                    </Row>
                    <Row className='pad-bottom'>
                        <Col xs={4} xsOffset={2}>
                            <CakeButton
                                bsSize='large'
                                onClick={() => {
                                    axios.get(
                                        'https://hooks.zapier.com/hooks/catch/403974/gtg3ka/',
                                        { params: { email: this.state.email } }
                                    );
                                }}
                            >
                                Yes, there was a change
                            </CakeButton>
                        </Col>
                        <Col xs={4}>
                            <CakeButton
                                cancelButton
                                bsSize='large'
                                onClick={() => this.handleCloseEditPersonalDetailsModal()}
                            >
                                Cancel
                            </CakeButton>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }

    renderEditFinancialDetailsModal() {
        return (
            <Modal
                bsSize='large'
                className='espp-details-modal'
                show={this.state.showEditFinancialDetailsModal}
                onHide={() => this.handleCloseEditFinancialDetailsModal()}
            >
                <Modal.Header
                    className='espp-details-modal-header'
                    closeButton
                />
                <Modal.Body>
                    <Row>
                        <BankAccountInfoEditor />
                    </Row>
                    <hr />
                    <Row>
                        <BrokerageCredentialsEditor />
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }

    render() {
        const {
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
        } = this.props;

        return (
            <Row className='espp-details dashboard-data-container'>
                { this.renderEditPersonalDetailsModal() }
                { this.renderEditFinancialDetailsModal() }
                <Col xs={6} className='border-right'>
                    <h3>Your ESPP: <span className='right'><big>{ company }</big></span></h3>
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
                <Col xs={6} className='border-left'>
                    <h3>Your Details: <span className='right'>
                        <a className='modal-link' onClick={() => this.handleShowEditPersonalDetailsModal()}>edit my personal details</a>
                    </span></h3>
                    <br />
                    Salary (annual): <strong>{ salary }</strong>
                    <br />
                    <br />
                    Current Paycheck Amount (post taxes): <strong>{ currentPaycheckAmount }</strong>
                    <br />
                    <br />
                    Pay Period: <strong>{ payPeriod }</strong>
                    <br />
                    <br />
                    Last Paycheck: <strong>{ lastPaycheck }</strong>
                    <br />
                    <br />
                    <h3>Financial Details: <span className='right'>
                        <a className='modal-link' onClick={() => this.handleShowEditFinancialDetailsModal()}>edit my financial details</a>
                    </span></h3>
                    <br />
                    <ObfuscatedBrokerageCredentials />
                    <br />
                    <ObfuscatedBankAccountInfo />
                </Col>
            </Row>
        );
    }
}

export const ESPPDetailsDefault = () => {
    return (
        <Row className='espp-details-default dashboard-data-container'>
            <Col xs={12}>
                <h4>Your Details</h4>
                <br />
                <div className='centered-text'>
                Your analyst is verifying your data. This section will populate after everything has been reviewed.
                </div>
                <br />
                <br />
            </Col>
            <img src={cakeImageSrc} />
        </Row>
    );
};