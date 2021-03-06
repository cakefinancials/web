import { Auth } from 'aws-amplify';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import { subscribeSessionChange, clearCurrentUserSession, fetchCurrentUserSession } from './libs/userState';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      currentSession: null,
      isAuthenticating: true,
    };
  }

  componentWillUnmount() {
    if (this.unsubscribeSessionChange) {
      this.unsubscribeSessionChange();
    }
  }

  async componentDidMount() {
    try {
      this.unsubscribeSessionChange = subscribeSessionChange(session => {
        if (session === null) {
          this.setState({ isAuthenticated: false, currentSession: null });
        } else {
          this.setState({ isAuthenticated: true, currentSession: session });
        }
      });
      await fetchCurrentUserSession();
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  handleLogout = async () => {
    await Auth.signOut();

    clearCurrentUserSession();
    window.location.replace('/login');
  };

  renderNavbar() {
    return (
      <div className="app-nav-container container-fluid">
        <Navbar fluid fixedTop collapseOnSelect style={{ backgroundColor: '#8f2cfa' }}>
          <Navbar.Header>
            <Navbar.Brand>
              <div className={'app-logo'} />
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated ? (
                <Fragment>
                  <Navbar.Text>{this.state.currentSession.idToken.payload.email}</Navbar.Text>
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                </Fragment>
              ) : (
                <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
    };

    // is this naughty? probably!
    const {
      location: { pathname: currentPath },
    } = this.props;
    if (['/login', '/signup', '/verify', '/forgot-password'].includes(currentPath)) {
      document.body.classList.add('login-signup-background');
    } else {
      document.body.classList.remove('login-signup-background');
    }

    return (
      !this.state.isAuthenticating && (
        <div>
          {this.renderNavbar()}
          <div className="App container">
            <Routes childProps={childProps} />
          </div>
        </div>
      )
    );
  }
}

export default withRouter(App);
