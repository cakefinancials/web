import { API } from 'aws-amplify';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HelpBlock, FormGroup, FormControl } from 'react-bootstrap';
import queryString from 'query-string';
import * as R from 'ramda';

import LoaderButton from '../components/LoaderButton';
import './Login.css';
import './AuthStyles.css';
import { Auth } from 'aws-amplify';
import { fetchCurrentUserSession } from '../libs/userState';

export default class Login extends Component {
    constructor(props) {
        super(props);
        const parsedSearch = queryString.parse(this.props.location.search);

        this.state = {
            isLoading: false,
            email: parsedSearch.email || '',
            password: '',
            errorMessage: undefined,
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (this.state.email.length === 0 || this.state.password.length === 0) {
            this.setState({ errorMessage: 'You must enter an email and a password to sign in' });

            return;
        }

        this.setState({ isLoading: true, errorMessage: undefined });

        try {
            await Auth.signIn(this.state.email, this.state.password);

            // save link, don't wait for result
            API.post('cake', '/link_email_to_id', {});

            await fetchCurrentUserSession();
        } catch (e) {
            this.setState({ isLoading: false, errorMessage: e.message });
        }
    }

    render() {
        return (
            <div className="Login auth-form-container center-text">
                <div className="cake-logo-container"></div>
                <h1>Cake Financials</h1>
                <br />
                {
                    !this.state.errorMessage ? null :
                        <div className='has-error'>
                            <HelpBlock>{this.state.errorMessage}</HelpBlock>
                        </div>
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
                            className={'auth-button'}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="LOGIN"
                            loadingText="LOGGING IN…"
                        />
                    </div>
                </form>
                <small> { 'Don\'t have an account? Create one ' } <Link to="/signup">here</Link></small>
                <br />
                <small><Link to="/forgot-password">Forgot your password? Click here to reset it.</Link></small>
                {
                    !R.path([ 'location', 'state', 'emailVerified' ], this.props) ? null :
                        <div className='login-toast'>
                            { 'You\'ve successfully confirmed your account, please login to continue' }
                        </div>
                }
                {
                    !R.path([ 'location', 'state', 'passwordReset' ], this.props) ? null :
                        <div className='login-toast'>
                            { 'You\'ve successfully reset your password, please login to continue' }
                        </div>
                }
            </div>
        );
    }
}
