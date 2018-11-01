import { API } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { HelpBlock, FormGroup, FormControl } from 'react-bootstrap';
import queryString from 'query-string';
import { fetchCurrentUserSession, userSignupPassword } from '../libs/userState';

import LoaderButton from '../components/LoaderButton';
import './AuthStyles.css';
import './Verify.css';

export default class Verify extends Component {
  constructor(props) {
    super(props);

    const parsedSearch = queryString.parse(this.props.location.search);

    this.state = {
      isLoading: false,
      email: parsedSearch.email || '',
      confirmationCode: '',
      confirmed: false,
      errorMessage: undefined,
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    if (this.state.confirmationCode.length === 0 || this.state.email.length === 0) {
      this.setState({ errorMessage: 'Please fill out the form below to verify your account' });
      return;
    }

    this.setState({ isLoading: true, errorMessage: undefined });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      const password = userSignupPassword.getUserSignupPassword();
      if (password.length > 0) {
        try {
          await Auth.signIn(this.state.email, password);
          // save link, don't wait for result
          API.post('cake', '/link_email_to_id', {});
          await fetchCurrentUserSession();
        } catch (e) {
          // could not log in for some reason, go to login page
          this.setState({ confirmed: true });
        }
      } else {
        this.setState({ confirmed: true });
      }
    } catch (e) {
      this.setState({ isLoading: false, errorMessage: e.message });
    }
  };

  renderConfirmationForm() {
    return (
      <div className="center-text">
        <div className="cake-logo-container" />
        <h1>Verify Account</h1>
        {!this.state.errorMessage ? null : (
          <div className="has-error">
            <HelpBlock>{this.state.errorMessage}</HelpBlock>
          </div>
        )}
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
            type="submit"
            isLoading={this.state.isLoading}
            text="VERIFY"
            loadingText="VERIFYING…"
          />
        </form>
      </div>
    );
  }

  renderConfirmed() {
    const qs = queryString.stringify({ email: this.state.email });

    return (
      <Redirect
        to={{
          pathname: '/login',
          search: `?${qs}`,
          state: { emailVerified: true },
        }}
      />
    );
  }

  render() {
    return (
      <div className="Verify auth-form-container">
        {this.state.confirmed ? this.renderConfirmed() : this.renderConfirmationForm()}
      </div>
    );
  }
}
