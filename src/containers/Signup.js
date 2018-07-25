import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    FormGroup,
    FormControl,
} from "react-bootstrap";
import queryString from "query-string";

import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import "./LoginSignupStyles.css";

import termsAndConditions from '../public/app/terms_and_conditions.htm';
import privacyPolicy from '../public/app/privacy_policy.htm';

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
        };
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });
            const qs = queryString.stringify({email: this.state.email});

            this.setState({ isLoading: false });
            this.props.history.push(`/verify?${qs}`);
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <FormControl
                        autoFocus
                        className={'login-signup-input'}
                        onChange={this.handleChange}
                        placeholder={'Email'}
                        type="email"
                        value={this.state.email}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormControl
                        className={'login-signup-input'}
                        onChange={this.handleChange}
                        placeholder={'Password'}
                        type="password"
                        value={this.state.password}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <FormControl
                        className={'login-signup-input'}
                        onChange={this.handleChange}
                        placeholder={'Confirm Password'}
                        type="password"
                        value={this.state.confirmPassword}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Signup"
                    loadingText="SIGNING UP…"
                />
            </form>
        );
    }

    render() {
        return (
            <div className="Signup center-text">
                <div className="cake-logo-container"></div>
                <h1>CREATE ACCOUNT</h1>
                <p><small>Welcome to Cake! Please sign up below to begin making money with cake</small></p>
                <br />
                {this.renderForm()}
                <small>Already have an account? Login <Link to="/login">here</Link></small>
                <br />
                <br />
                <br />
                <br />
                <p className="ts-and-cs-pp">
                    <small>
                        <a href={termsAndConditions} target="_blank">Terms and Conditions</a>
                        { ' | ' }
                        <a href={privacyPolicy} target="_blank">Privacy Policy</a>
                    </small>
                </p>
            </div>
        );
    }
}
