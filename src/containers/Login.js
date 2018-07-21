import { API } from "aws-amplify";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { HelpBlock, FormGroup, FormControl } from "react-bootstrap";
import queryString from "query-string";

import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import "./LoginSignupStyles.css";
import { Auth } from "aws-amplify";
import { setCurrentUserSession } from "../libs/userState";

export default class Login extends Component {
    constructor(props) {
        super(props);
        const parsedSearch = queryString.parse(this.props.location.search);

        this.state = {
            isLoading: false,
            email: parsedSearch.email || "",
            password: "",
            errorMessage: undefined
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
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
            await Auth.signIn(this.state.email, this.state.password);

            // save link, don't wait for result
            API.post("cake", "/link_email_to_id", {});

            const currentSession = await Auth.currentSession();

            setCurrentUserSession(currentSession);
        } catch (e) {
            this.setState({ isLoading: false, errorMessage: e.message });
        }
    }

    render() {
        return (
            <div className="Login center-text">
                <div className="cake-logo-container"></div>
                <h1>Cake Financials</h1>
                <br />
                {
                    !!this.state.errorMessage ?
                    <div className='has-error'>
                        <HelpBlock>{this.state.errorMessage}</HelpBlock>
                    </div> : null
                }
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <FormControl
                            autoFocus={this.state.email.length === 0}
                            className={'login-signup-input'}
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder={'Email'}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <FormControl
                            autoFocus={this.state.email.length > 0}
                            className={'login-signup-input'}
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder={'Password'}
                            type="password"
                        />
                    </FormGroup>
                    <div>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in…"
                    /></div>
                </form>
                <small>Don't have an account? Create one <Link to="/signup">here</Link></small>
            </div>
        );
    }
}
