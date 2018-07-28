import React, { Component } from 'react';
import { Col, Glyphicon, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import { ObfuscatedBankAccountInfo, BankAccountInfoEditor } from '../BankAccountInfo';
import { ObfuscatedBrokerageCredentials, BrokerageCredentialsEditor } from '../BrokerageCredentials';

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
            showEditPersonalDetailsModal: false
        };
    }

    handleCloseEditPersonalDetailsModal() {
        this.setState({ showEditPersonalDetailsModal: false });
    }

    handleShowEditPersonalDetailsModal() {
        this.setState({ showEditPersonalDetailsModal: true });
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
                        <a className='modal-link' onClick={() => {}}>edit my personal details</a>
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
                        <a className='modal-link' onClick={() => this.handleShowEditPersonalDetailsModal()}>edit my financial details</a>
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
    return null;
};