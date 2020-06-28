import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './Candidate.scss';
import UserCard from './../Card/Card';
import Spinner from './../Spinner/Spinner';
import { getUsers } from './../../actions/actions';

const CandidatePage = ({ users, getUsers, loading }) => {
  useEffect(() => {
    getUsers();
  }, []);
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="candidatePage">
        {users &&
          users.map((user, i) => {
            if (user.role === 'employee' && user.resume) {
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
export default connect(mapStateToProps, { getUsers })(CandidatePage);
