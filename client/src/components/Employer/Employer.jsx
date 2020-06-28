import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './Employer.scss';
import UserCard from './../Card/Card';
import Spinner from './../Spinner/Spinner';
import { getUsers } from './../../actions/actions';

const EmployerPage = ({ getUsers, users, loading }) => {
  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="employees">
        {users &&
          users.map((user, i) => {
            if (user.role === 'employer') {
              return <UserCard data={user} key={i} />;
            }
          })}
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    users: state.user.users,
    loading: state.loader.loading
  };
};

export default connect(mapStateToProps, { getUsers })(EmployerPage);
