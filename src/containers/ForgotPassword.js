import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { HelpBlock, FormGroup, FormControl } from 'react-bootstrap';
import queryString from 'query-string';

import LoaderButton from '../components/LoaderButton';
import './AuthStyles.css';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    const parsedSearch = queryString.parse(this.props.location.search);

    this.state = {
      isLoading: false,
      email: parsedSearch.email || '',
      codeSent: false,
      confirmationCode: '',
      newPassword: '',
      reset: false,
      errorMessage: undefined,
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleSendCodeSubmit = async event => {
    event.preventDefault();

    if (this.state.email.length === 0) {
      this.setState({ errorMessage: 'Please enter your email so you can receive your reset code' });
      return;
    }

    this.setState({ isLoading: true, errorMessage: undefined });

    try {
      await Auth.forgotPassword(this.state.email);
      this.setState({ isLoading: false, codeSent: true });
    } catch (e) {
      let errorMessage = 'Email not found.';
      if (!e.message.toUpperCase().includes('USERNAME')) {
        errorMessage = e.message;
      }
      this.setState({ isLoading: false, errorMessage });
    }
  };

  handlePasswordResetSubmit = async event => {
    event.preventDefault();

    if (this.state.confirmationCode.length === 0 || this.state.newPassword.length === 0) {
      this.setState({ errorMessage: 'Please fill out the form below to reset your password' });
      return;
    }

    this.setState({ isLoading: true, errorMessage: undefined });

    try {
      await Auth.forgotPasswordSubmit(this.state.email, this.state.confirmationCode, this.state.newPassword);
      this.setState({ reset: true });
    } catch (e) {
      let errorMessage = 'Your password must be at least 8 characters long and have a number and a special character';
      if (!e.message.toUpperCase().includes('PASSWORD')) {
        errorMessage = e.message;
      }
      this.setState({ isLoading: false, errorMessage });
    }
  };

  renderWithForgotPasswordContainer(inner) {
    return (
      <div className="center-text">
        <div className="cake-logo-container" />
        <h1>Forgot Password</h1>
        {!this.state.errorMessage ? null : (
          <div className="has-error">
            <HelpBlock>{this.state.errorMessage}</HelpBlock>
          </div>
        )}
        {inner}
      </div>
    );
  }

  renderPasswordResetForm() {
    return this.renderWithForgotPasswordContainer(
      <form onSubmit={this.handlePasswordResetSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <FormControl
            autoFocus={true}
            className={'login-signup-input'}
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
            placeholder={'Confirmation Code'}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <FormGroup controlId="newPassword" bsSize="large">
          <FormControl
            autoFocus={false}
            className={'login-signup-input'}
            type="password"
            value={this.state.newPassword}
            onChange={this.handleChange}
            placeholder={'New Password'}
          />
          <HelpBlock>Please enter a new password.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          type="submit"
          isLoading={this.state.isLoading}
          text="RESET PASSWORD"
          loadingText="RESETTING…"
        />
      </form>
    );
  }

  renderSendCodeForm() {
    return this.renderWithForgotPasswordContainer(
      <form onSubmit={this.handleSendCodeSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <FormControl
            autoFocus={true}
            className={'login-signup-input'}
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder={'Email'}
          />
          <HelpBlock>Enter the email you used when signing up.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          type="submit"
          isLoading={this.state.isLoading}
          text="SEND CODE"
          loadingText="SENDING…"
        />
      </form>
    );
  }

  renderReset() {
    const qs = queryString.stringify({ email: this.state.email });

    return (
      <Redirect
        to={{
          pathname: '/login',
          search: `?${qs}`,
          state: { passwordReset: true },
        }}
      />
    );
  }

  render() {
    let content;
    if (this.state.reset && this.state.codeSent) {
      content = this.renderReset();
    } else if (this.state.codeSent) {
      content = this.renderPasswordResetForm();
    } else {
      content = this.renderSendCodeForm();
    }

    return <div className="ForgotPassword auth-form-container">{content}</div>;
  }
}
