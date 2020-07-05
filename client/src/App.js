import React, { useEffect, Component, useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './history';
import { connect } from 'react-redux';

import Nav from './components/nav/Nav';
import HomePage from './components/Homepage/HomePage';
import DashBoard from './components/DashBoard';
import CandidatePage from './components/Candidate/Candidate';
import EmployerPage from './components/Employer/Employer';
import JobList from './components/JobList/JobList';
import Error from './components/Error/Error';
import Spinner from './components/Spinner/Spinner';
import Form from './components/form/form';
import { getCurrentUserAndStatus } from './actions/actions';
import PrivateRoute from './components/routes/PrivateRoutes';
import JobDetails from './components/JobDetails/JobDetails';
import userDetails from './components/UserDetails/UserDetails';
import Category from './components/Homepage/Category/Category';
import CategoryListPage from './components/CategoryListPage/CategoryListPage';

function App({ getCurrentUserAndStatus, loading }) {
  useEffect(() => {
    getCurrentUserAndStatus();
  }, []);

  return (
    <div className="App">
      <Router history={history}>
        <Nav />
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <PrivateRoute path="/dashboard" exact={true} component={DashBoard} />
          <Route path="/candidates" exact={true} component={CandidatePage} />
          <Route path="/employers" exact={true} component={EmployerPage} />
          <Route exact path="/users/:id" component={userDetails} />
          <Route
            path="/candidateSignUp"
            exact={true}
            render={props => <Form {...props} formName="candidateSignUpForm" />}
          />
          <Route
            path="/employerSignUp"
            exact={true}
            render={props => <Form {...props} formName="employerSignUpForm" />}
          />
          <Route
            path="/jobs/edit/:id"
            forName="editJobForm"
            exact={true}
            component={Form}
          />
          <Route path="/jobs/:id" exact={true} component={JobDetails} />
          <Route path="/jobs" exact={true} component={JobList} />
          <Route path="/categories" exact={true} component={Category} />
          <Route
            path="/categories/:id"
            exact={true}
            component={CategoryListPage}
          />
          <Route path="/error" exact={true} component={Error} />
          <Route path="/spinner" exact={true} component={Spinner} />
        </Switch>
      </Router>
    </div>
  );
}

export default connect(null, {
  getCurrentUserAndStatus
})(App);
