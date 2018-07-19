import { Auth } from "aws-amplify";
import React, { Component } from "react";
import {
    HelpBlock,
    FormGroup,
    FormControl,
} from "react-bootstrap";
import queryString from "query-string";

import LoaderButton from "../components/LoaderButton";
import "./LoginSignupStyles.css";
import "./Verify.css";

export default class Verify extends Component {
    constructor(props) {
        super(props);

        const parsedSearch = queryString.parse(this.props.location.search);

        this.state = {
            isLoading: false,
            email: parsedSearch.email || "",
            confirmationCode: "",
            confirmed: false,
        };
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0
            && this.state.email.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            this.setState({ confirmed: true });
        } catch (e) {
            alert(e.message);
        }

        this.setState({ isLoading: false });
    }

    renderConfirmationForm() {
        return (
            <div className="Login center-text">
                <div className="cake-logo-container"></div>
                <h1>Verify Account</h1>
                <form onSubmit={this.handleConfirmationSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <FormControl
                            autoFocus={this.state.email.length === 0}
                            className={'login-signup-input'}
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder={'Email'}
                        />
                        <HelpBlock>Enter the email you used when signing up.</HelpBlock>
                    </FormGroup>
                    <FormGroup controlId="confirmationCode" bsSize="large">
                        <FormControl
                            autoFocus={this.state.email.length > 0}
                            className={'login-signup-input'}
                            type="tel"
                            value={this.state.confirmationCode}
                            onChange={this.handleChange}
                            placeholder={'Confirmation Code'}
                        />
                        <HelpBlock>Please check your email for the code.</HelpBlock>
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateConfirmationForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Verify"
                        loadingText="Verifying…"
                    />
                </form>
            </div>
        );
    }

    renderConfirmed() {
        const qs = queryString.stringify({email: this.state.email});
        const loginLink = `/login?${qs}`;

        return (
            <div className="lander">
                <p>
                    You've successfully confirmed your account. Please go <a href={loginLink}>here</a> to log in
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className="Verify">
                {this.state.confirmed ? this.renderConfirmed() : this.renderConfirmationForm()}
            </div>
        );
    }
}
