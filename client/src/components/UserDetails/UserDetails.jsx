import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import './userDetails.scss';
import { getUser, downloadResume } from '../../actions/actions';
import { REACT_APP_STATIC_IMAGE_PATH } from './../../static';

const UserDetails = ({ getUser, match, openUser, downloadResume }) => {
  useEffect(() => {
    getUser(match.params.id);
  }, []);

  const handleDownload = e => {
    downloadResume(match.params.id);
  };
  return (
    openUser && (
      <div className="userDetails">
        <div className="userDetails-img-wrapper">
          <img
            className="userDetails-img-wrapper__img"
            alt="profile"
            src={`${REACT_APP_STATIC_IMAGE_PATH}/${openUser.image}`}
          />
        </div>
        <div className="userDetails-content">
          <div className="userDetails-content__name">
            Name: {openUser && openUser.userName}
          </div>
          <span className="userDetails-content__role">
            Role: {openUser && openUser.role}
          </span>
          <div className="userDetails-content__email">
            Email: {openUser && openUser.email}
          </div>
          <div className="userDetails-content__phone">
            Phone : {openUser && openUser.phone}
          </div>
          {openUser && openUser.companyName ? (
            <div className="userDetails-content__company">
              {openUser.companyName}
            </div>
          ) : null}
          {openUser && openUser.role === 'employee' ? (
            <button
              className="userDetails-content__download"
              onClick={handleDownload}
            >
              Download resume
            </button>
          ) : null}
        </div>
      </div>
    )
  );
};

const mapStateToProps = state => {
  return {
    openUser: state.user.openUser
  };
};

export default connect(mapStateToProps, { getUser, downloadResume })(
  UserDetails
);
