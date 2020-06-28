import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';

import './adminStyle.scss';
import Sidebar from '../Sidebar/Sidebar';
import UserCard from './../Card/Card';
import JobItem from './../Homepage/JobItem/JobItem';
import Form from './../form/form';
import Spinner from './../Spinner/Spinner';
import jobContext from './../../context/jobContext';
import { logOut, getUsers, getJobs } from './../../actions/actions';

const Dashboard = ({ getUsers, getJobs, logOut, jobs, user }) => {
  const { users } = user;
  const [selectedItem, setselectedItem] = useState('JOBS');
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    getUsers();
    getJobs();
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleClick = event => {
    if (event.target.innerText === 'LOG OUT') {
      logOut();
    }
    setselectedItem(event.target.innerText);
  };
  const renderDashBoardContent = item => {
    switch (item) {
      case 'JOBS':
        if (
          user &&
          user.currentUser &&
          user.currentUser.role === 'employee' &&
          !user.currentUser.resume
        ) {
          return (
            <div className="complete-profile">
              <h5
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: '#334E6F',
                  marginTop: '1rem',
                  marginBottom: '-3rem'
                }}
              >
                Complete your profile get recommendations!
              </h5>
              <Form formName="employeeForm" />
            </div>
          );
        } else {
          return (
            <div className="content-job">
              {jobs &&
                jobs.length > 0 &&
                jobs.map((job, i) => {
                  return <JobItem key={i} item={job} />;
                })}
            </div>
          );
        }
      case 'EMPLOYEE':
        return (
          <div className="content-user">
            {users &&
              users.map((user, i) => {
                if (user.role === selectedItem.toLowerCase()) {
                  return <UserCard data={user} key={i} />;
                }
              })}
          </div>
        );
      case 'EMPLOYER':
        return (
          <div className="content-user">
            {users &&
              users.map((user, i) => {
                if (user.role === selectedItem.toLowerCase()) {
                  return <UserCard data={user} key={i} />;
                }
              })}
          </div>
        );
      case 'EDIT PROFILE':
        return (
          <div className="edit-user">
            <Form formName="editForm" />
          </div>
        );
      case 'POST A JOB':
        if (
          user &&
          user.currentUser &&
          user.currentUser.role === 'employer' &&
          !user.currentUser.companyName
        ) {
          return (
            <div className="complete-profile">
              <h5
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: '#334E6F',
                  marginTop: '1rem',
                  marginBottom: '-3rem'
                }}
              >
                Complete your profile to post a job
              </h5>
              <Form formName="employerForm" />
            </div>
          );
        } else {
          return <Form formName="createJob" />;
        }

      case 'EDIT PASSWORD':
        return (
          <section>
            <Form formName="editPassword" />
          </section>
        );

      case 'MY JOBS':
        const currentUserId = user && user.currentUser && user.currentUser._id;

        return (
          <div className="content-job">
            {jobs &&
              jobs.length > 0 &&
              currentUserId &&
              jobs.map((job, index) => {
                if (job.createdBy.toString() === currentUserId.toString()) {
                  return <JobItem key={index} item={job} owner={true} />;
                }
              })}
          </div>
        );
      case 'CREATE JOB CATEGORY':
        return (
          <div>
            <div>
              <Form formName="createCategory" />;
            </div>
          </div>
        );
      case 'RESUME':
        return <div className="resume">resume</div>;
      default:
        return (
          <div className="content-job">
            {jobs &&
              jobs.length > 0 &&
              jobs.map((job, i) => {
                return <JobItem key={i} item={job} />;
              })}
          </div>
        );
    }
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="admin-dashboard">
        <Sidebar handleClick={handleClick} />
        <div className="content">
          <div className="content-title">
            <SettingsIcon color="primary" fontSize="large" />
            <h2 className="content-title__heading">{`${
              user && user.currentUser && user.currentUser.role
                ? user.currentUser.role.toUpperCase()
                : ''
            } DASHBOARD`}</h2>
          </div>
          <jobContext.Provider
            value={
              user && user.currentUser && user.currentUser.role
                ? `adminDashboard ${user.currentUser.role}`
                : undefined
            }
          >
            {renderDashBoardContent(selectedItem)}
          </jobContext.Provider>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    jobs: state.job.jobs,
    user: state.user
    // loading: state.loader.loading
  };
};

export default connect(mapStateToProps, { getJobs, getUsers, logOut })(
  Dashboard
);
