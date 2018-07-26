import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import AppliedRoute from './components/AppliedRoute';
import Signup from './containers/Signup';
import Verify from './containers/Verify';
import ForgotPassword from './containers/ForgotPassword';
//import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

const Router = ({ childProps }) =>
    <Switch>
        <AppliedRoute path='/' exact component={Home} props={childProps} />
        <UnauthenticatedRoute path='/login' exact component={Login} props={childProps} />
        <UnauthenticatedRoute path='/signup' exact component={Signup} props={childProps} />
        <UnauthenticatedRoute path='/verify' exact component={Verify} props={childProps} />
        <UnauthenticatedRoute path='/forgot-password' exact component={ForgotPassword} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;

export default Router;

// <AuthenticatedRoute path="/notes/:id" exact component={Notes} props={childProps} />
