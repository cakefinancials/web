import React, { Component, Fragment } from 'react';
import {
    Button,
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    HelpBlock,
} from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import Lock from './helpers/Lock';
import CakeButton from './helpers/CakeButton';
import * as R from 'ramda';

import './helpers/FormStyles.css';

import { saveBankDetails, subscribeObfuscatedBankDetails } from '../libs/userState';

export class BankAccountInfoEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSaving: false,
            routingNumber: '',
            accountNumber: '',
        };
    }

    validateABARoutingNumber = (routingNumber) => {
        const match = routingNumber.match(/^([\d]{9})$/);
        if (!match) {
            return false;
        }

        const weights = [ 3, 7, 1 ];
        const aba = match[1];

        var sum = 0;
        for (var i = 0; i < 9; ++i) {
            sum += aba.charAt(i) * weights[i % 3];
        }

        return (sum !== 0 && sum % 10 === 0);
    }

    validateAccountNumber = (accountNumber) => {
        const match = accountNumber.match(/^([\d]{4,18})$/);

        return match;
    }

    validateBankInfoForm = () => {
        return {
            routingNumberValidation: this.validateABARoutingNumber(this.state.routingNumber),
            accountNumberValidation: this.validateAccountNumber(this.state.accountNumber),
        };
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isSaving: true });

        try {
            await this.saveBankInfo({
                routingNumber: this.state.routingNumber,
                accountNumber: this.state.accountNumber,
            });
        } catch (e) {
            alert(e);
        }

        this.setState({ isSaving: false });
        this.props.bankAccountInfoSaved();
    }

    saveBankInfo(bankInfo) {
        return saveBankDetails(bankInfo);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    renderSavingContent = () => {
        return (
            <LoadingSpinner bsSize='large' text='Saving...' />
        );
    }

    renderSaveForm = () => {
        const { routingNumberValidation, accountNumberValidation } = this.validateBankInfoForm();
        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormGroup
                        controlId='routingNumber'
                        validationState={routingNumberValidation ? null : 'error'}
                    >
                        <Col componentClass={ControlLabel} className={'cake-form-label'} xs={3}>
                            Routing Number
                        </Col>
                        <Col xs={8}>
                            <FormControl
                                className={'cake-form-input'}
                                onChange={this.handleChange}
                                value={this.state.routingNumber}
                            />
                            {
                                routingNumberValidation ? null :
                                    <HelpBlock>Routing numbers must be 9 digits long</HelpBlock>
                            }
                        </Col>
                        <Col className='checked-lock-icon' xs={1}>
                            <Lock check />
                        </Col>
                    </FormGroup>
                    <FormGroup
                        controlId='accountNumber'
                        validationState={accountNumberValidation ? null : 'error'}
                    >
                        <Col componentClass={ControlLabel} className={'cake-form-label'} xs={3}>
                            Account Number
                        </Col>
                        <Col xs={8}>
                            <FormControl
                                className={'cake-form-input'}
                                onChange={this.handleChange}
                                value={this.state.accountNumber}
                            />
                            {
                                accountNumberValidation ? null :
                                    <HelpBlock>Account numbers are between 4 and 18 digits long</HelpBlock>
                            }
                        </Col>
                        <Col className='checked-lock-icon' xs={1}>
                            <Lock check />
                        </Col>
                    </FormGroup>
                    <br />
                    <Col xs={6} xsOffset={3}>
                        <CakeButton
                            block
                            bsSize='large'
                            disabled={!(routingNumberValidation && accountNumberValidation)}
                            type='submit'
                        >
                            { this.props.saveButtonText || 'Save' }
                        </CakeButton>
                        {
                            this.props.showCancel ? (
                                <Button
                                    block
                                    bsStyle='warning'
                                    bsSize='large'
                                    onClick={() => {
                                        this.props.onCancelClicked();
                                    }}
                                >
                                    CANCEL
                                </Button>
                            ) : null
                        }
                    </Col>
                </Form>
            </div>
        );
    }

    render = () => {
        return this.state.isSaving ? this.renderSavingContent() : this.renderSaveForm();
    }
}

export class ObfuscatedBankAccountInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            isLoading: true,
            obfuscatedRoutingNumber: '',
            obfuscatedAccountNumber: '',
        };
    }

    componentDidMount() {
        this.unsubscribeObfuscatedBankDetails = subscribeObfuscatedBankDetails(
            ({ obfuscatedBankDetails, loading, error }) => {
                this.setState({
                    error,
                    isLoading: loading,
                    obfuscatedRoutingNumber: R.prop('routingNumber', obfuscatedBankDetails),
                    obfuscatedAccountNumber: R.prop('accountNumber', obfuscatedBankDetails)
                });
            }
        );
    }

    componentWillUnmount() {
        if (this.unsubscribeObfuscatedBankDetails) {
            this.unsubscribeObfuscatedBankDetails();
        }
    }

    renderLoading = () => {
        return (
            <LoadingSpinner bsSize='large' text='Loading existing bank account info...' />
        );
    }

    renderLoaded = () => {
        return (
            <Fragment>
                <span>{`Bank Routing Number: ${this.state.obfuscatedRoutingNumber}`}</span>
                <br />
                <br />
                <span>{`Bank Account Number: ${this.state.obfuscatedAccountNumber}`}</span>
            </Fragment>
        );
    }

    render = () => {
        return (
            <div>
                { this.state.isLoading ? this.renderLoading() : this.renderLoaded() }
            </div>
        );
    }
}
