import React, { Component, Fragment } from "react";
import {
    Button,
    ControlLabel,
    FormControl,
    FormGroup,
    HelpBlock,
} from "react-bootstrap";
import { API } from "aws-amplify";
import LoadingSpinner from "./LoadingSpinner";

export default class BrokerageCredentials extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            brokerageCredentialsExist: null,
            showForm: false,
        };
    }

    async queryForExistenceOfBrokerageCredentials() {
        try {
            const response = await API.get("cake", "/brokerage/credentials/exists");
            return !!response.exists;
        } catch (e) {
            alert(e);
        }

        return false;
    }

    async componentDidMount() {
        const brokerageCredentialsExist = await this.queryForExistenceOfBrokerageCredentials();
        this.setState({ isLoading: false, brokerageCredentialsExist, showForm: !brokerageCredentialsExist });
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
        return this.state.brokerageCredentialsExist ? <ObfuscatedBrokerageCredentials /> : null;
    }

    renderLoaded = () => {
        return (
            this.state.showForm ? (
                <Fragment>
                    { this.renderObfuscatedData() }
                    <p>Please enter your brokerage credentials</p>
                    <BrokerageCredentialsEditor
                        brokerageCredentialsSaved={() => {
                            this.setState({ brokerageCredentialsExist: true, showForm: false })
                        }}
                        onCancelClicked={() => { this.setState({ showForm: false }) }}
                        showCancel={ !!this.state.brokerageCredentialsExist }
                    />
                </Fragment>
            ) : (
                    <Fragment>
                        <p>You've already added your brokerage credentials</p>
                        <Button onClick={this.handleUpdateClick}>Update</Button>
                    </Fragment>
                )
        );
    }

    render() {
        return (
            <div>
                <h2>Brokerage Credentials</h2>
                {this.state.isLoading ? this.renderLoading() : this.renderLoaded()}
            </div>
        );
    }
}

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
        return API.post("cake", "/brokerage/credentials", { body: brokerageCredentials });
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
            <LoadingSpinner bsSize="large" text="Saving..." />
        );
    }

    renderSaveForm = () => {
        const {usernameValidation, passwordValidation, brokerageValidation} = this.validateBrokerageCredentialsForm();
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup
                        controlId="brokerage"
                        validationState={brokerageValidation ? null : "error"}
                    >
                        <ControlLabel>Brokerage</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.brokerage}
                        />
                        {
                            brokerageValidation ? null :
                                <HelpBlock>The name of your brokerage cannot be blank</HelpBlock>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="username"
                        validationState={usernameValidation ? null : "error"}
                    >
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.username}
                        />
                        {
                            usernameValidation ? null :
                                <HelpBlock>The username that you use to login to your brokerage cannot be blank</HelpBlock>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="password"
                        validationState={passwordValidation ? null : "error"}
                    >
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.password}
                        />
                        {
                            passwordValidation ? null :
                                <HelpBlock>The password that you use to login to your brokerage cannot be blank</HelpBlock>
                        }
                    </FormGroup>
                    <Button
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!(usernameValidation && passwordValidation && brokerageValidation)}
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
};

class ObfuscatedBrokerageCredentials extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            obfuscatedUsername: "",
            obfuscatedBrokerage: "",
        };
    }

    async queryForObfuscatedData() {
        try {
            const response = await API.get("cake", "/brokerage/credentials/obfuscated");
            return {
                obfuscatedUsername: response.username,
                obfuscatedBrokerage: response.brokerage,
            };
        } catch (e) {
            alert(e);
        }

        return undefined;
    }

    async componentDidMount() {
        const obfuscatedData = await this.queryForObfuscatedData();
        this.setState({
            isLoading: false,
            ...obfuscatedData
        });
    }

    renderLoading = () => {
        return (
            <LoadingSpinner bsSize="large" text="Loading existing brokerage credentials..." />
        );
    }

    renderLoaded = () => {
        return (
            <Fragment>
                <p>{`Current Brokerage: ${this.state.obfuscatedBrokerage}`}</p>
                <p>{`Current Username: ${this.state.obfuscatedUsername}`}</p>
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
