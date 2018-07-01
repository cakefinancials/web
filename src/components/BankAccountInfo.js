import React, { Component, Fragment } from "react";
import {
    Button,
    ControlLabel,
    FormControl,
    FormGroup,
    HelpBlock,
} from "react-bootstrap";
import "./BankAccountInfo.css";
import { API } from "aws-amplify";
import LoadingSpinner from "./LoadingSpinner";

export default class BankAccountInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            bankAccountInfoExists: null,
            showForm: false
        };
    }

    async queryForExistenceOfBankAccountInfo() {
        try {
            const response = await API.get("cake", "/bank/account_info/exists");
            return !!response.exists;
        } catch (e) {
            alert(e);
        }

        return false;
    }

    async componentDidMount() {
        const bankAccountInfoExists = await this.queryForExistenceOfBankAccountInfo();
        this.setState({ isLoading: false, bankAccountInfoExists, showForm: !bankAccountInfoExists });
    }

    renderLoading = () => {
        return (
            <LoadingSpinner bsSize="large" text="Working..." />
        );
    }

    handleUpdateClick = event => {
        this.setState({ showForm: true });
    }

    renderObfuscatedData = () => {
        return this.state.bankAccountInfoExists ? <ObfuscatedBankAccountInfo /> : null;
    }

    renderLoaded = () => {
        return (
            this.state.showForm ? (
                <Fragment>
                    { this.renderObfuscatedData() }
                    <p>Please enter your bank info</p>
                    <BankAccountInfoEditor
                        bankAccountInfoSaved={() => {
                            this.setState({ bankAccountInfoExists: true, showForm: false })
                        }}
                        onCancelClicked={() => { this.setState({ showForm: false }) }}
                        showCancel={ !!this.state.bankAccountInfoExists }
                    />
                </Fragment>
            ) : (
                <Fragment>
                    <p>You've already added bank info</p>
                    <Button onClick={this.handleUpdateClick}>Update</Button>
                </Fragment>
            )
        );
    }

    render() {
        return (
            <div>
                <h2>Bank Account Info</h2>
                {this.state.isLoading ? this.renderLoading() : this.renderLoaded()}
            </div>
        );
    }
}

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

        const weights = [3, 7, 1];
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
        return API.post("cake", "/bank/account_info", { body: bankInfo });
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    renderSavingContent = () => {
        return (
            <LoadingSpinner bsSize="large" text="Saving..." />
        );
    }

    renderSaveForm = () => {
        const { routingNumberValidation, accountNumberValidation } = this.validateBankInfoForm();
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup
                        controlId="routingNumber"
                        validationState={routingNumberValidation ? null : "error"}
                    >
                        <ControlLabel>Routing Number</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.routingNumber}
                        />
                        {
                            routingNumberValidation ? null :
                                <HelpBlock>Routing numbers must be 9 digits long</HelpBlock>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="accountNumber"
                        validationState={accountNumberValidation ? null : "error"}
                    >
                        <ControlLabel>Account Number</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.accountNumber}
                        />
                        {
                            accountNumberValidation ? null :
                                <HelpBlock>Account numbers are between 4 and 18 digits long</HelpBlock>
                        }
                    </FormGroup>
                    <Button
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!(routingNumberValidation && accountNumberValidation)}
                        type="submit"
                    >
                        Save
                    </Button>
                    {
                        this.props.showCancel ? (
                            <Button
                                block
                                bsStyle="warning"
                                bsSize="large"
                                onClick={e => {
                                    this.props.onCancelClicked();
                                }}
                            >
                                Cancel
                            </Button>
                        ) : null
                    }
                </form>
            </div>
        );
    }

    render = () => {
        return this.state.isSaving ? this.renderSavingContent() : this.renderSaveForm();
    }
}

class ObfuscatedBankAccountInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            obfuscatedRoutingNumber: "",
            obfuscatedAccountNumber: "",
        };
    }

    async queryForObfuscatedBankAccountInfo() {
        try {
            const response = await API.get("cake", "/bank/account_info/obfuscated");
            return {
                obfuscatedAccountNumber: response.accountNumber,
                obfuscatedRoutingNumber: response.routingNumber,
            };
        } catch (e) {
            alert(e);
        }

        return undefined;
    }

    async componentDidMount() {
        const obfuscatedBankAccountInfo = await this.queryForObfuscatedBankAccountInfo();
        this.setState({
            isLoading: false,
            ...obfuscatedBankAccountInfo
        });
    }

    renderLoading = () => {
        return (
            <LoadingSpinner bsSize="large" text="Loading existing bank account info..." />
        );
    }

    renderLoaded = () => {
        return (
            <Fragment>
                <p>{`Current Routing Number: ${this.state.obfuscatedRoutingNumber}`}</p>
                <p>{`Current Account Number: ${this.state.obfuscatedAccountNumber}`}</p>
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
