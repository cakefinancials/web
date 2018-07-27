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

import { saveBrokerageCredentials, subscribeObfuscatedBrokerageData } from '../libs/userState';
export class BrokerageCredentialsEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSaving: false,
            username: '',
            password: '',
            brokerage: '',
        };
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isSaving: true });

        try {
            await this.saveBrokerageCredentials({
                username: this.state.username,
                password: this.state.password,
                brokerage: this.state.brokerage,
            });
        } catch (e) {
            alert(e);
        }

        this.setState({ isSaving: false });
        this.props.brokerageCredentialsSaved();
    }

    saveBrokerageCredentials(brokerageCredentials) {
        return saveBrokerageCredentials(brokerageCredentials);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    validateUsername = (username) => {
        return username.length > 0;
    }

    validatePassword = (password) => {
        return password.length > 0;
    }

    validateBrokerage = (brokerage) => {
        return brokerage.length > 0;
    }

    validateBrokerageCredentialsForm = () => {
        return {
            usernameValidation: this.validateUsername(this.state.username),
            passwordValidation: this.validatePassword(this.state.password),
            brokerageValidation: this.validateBrokerage(this.state.brokerage),
        };
    }

    renderSavingContent = () => {
        return (
            <LoadingSpinner bsSize='large' text='Saving...' />
        );
    }

    renderSaveForm = () => {
        const { usernameValidation, passwordValidation, brokerageValidation } = this.validateBrokerageCredentialsForm();
        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormGroup
                        controlId='brokerage'
                        validationState={brokerageValidation ? null : 'error'}
                    >
                        <Col componentClass={ControlLabel} className={'cake-form-label'} xs={3}>
                            Brokerage Website
                        </Col>
                        <Col xs={8}>
                            <FormControl
                                className={'cake-form-input'}
                                onChange={this.handleChange}
                                value={this.state.brokerage}
                            />
                            {
                                brokerageValidation ? null :
                                    <HelpBlock>Your brokerage website cannot be blank</HelpBlock>
                            }
                        </Col>
                        <Col className='checked-lock-icon' xs={1}>
                            <Lock check />
                        </Col>
                    </FormGroup>
                    <FormGroup
                        controlId='username'
                        validationState={usernameValidation ? null : 'error'}
                    >
                        <Col componentClass={ControlLabel} className={'cake-form-label'} xs={3}>
                            Brokerage Username
                        </Col>
                        <Col xs={8}>
                            <FormControl
                                className={'cake-form-input'}
                                onChange={this.handleChange}
                                value={this.state.username}
                            />
                            {
                                usernameValidation ? null :
                                    <HelpBlock>The username that you use to login to your brokerage cannot be blank</HelpBlock>
                            }
                        </Col>
                        <Col className='checked-lock-icon' xs={1}>
                            <Lock check />
                        </Col>
                    </FormGroup>
                    <FormGroup
                        controlId='password'
                        validationState={passwordValidation ? null : 'error'}
                    >
                        <Col componentClass={ControlLabel} className={'cake-form-label'} xs={3}>
                            Brokerage Password
                        </Col>
                        <Col xs={8}>
                            <FormControl
                                className={'cake-form-input'}
                                onChange={this.handleChange}
                                type='password'
                                value={this.state.password}
                            />
                            {
                                passwordValidation ? null :
                                    <HelpBlock>The password that you use to login to your brokerage cannot be blank</HelpBlock>
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
                            disabled={!(usernameValidation && passwordValidation && brokerageValidation)}
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

export class ObfuscatedBrokerageCredentials extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            obfuscatedUsername: '',
            obfuscatedBrokerage: '',
        };
    }

    componentDidMount() {
        this.unsubscribeObfuscatedBankDetails = subscribeObfuscatedBrokerageData(
            ({ obfuscatedBrokerageData, loading, error }) => {
                this.setState({
                    error,
                    isLoading: loading,
                    obfuscatedUsername: R.prop('username', obfuscatedBrokerageData),
                    obfuscatedBrokerage: R.prop('brokerage', obfuscatedBrokerageData)
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
            <LoadingSpinner bsSize="large" text="Loading existing brokerage credentials..." />
        );
    }

    renderLoaded = () => {
        return (
            <Fragment>
                <span>Brokerage: <strong>{ this.state.obfuscatedBrokerage }</strong></span>
                <br />
                <br />
                <span>
                    Username & Password:
                    <Lock style={{ marginLeft: '5px', marginRight: '5px' }} />
                    encrypted
                </span>
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
