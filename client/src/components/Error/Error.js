import React from 'react';
import { connect } from 'react-redux';

import './Error.scss';
import history from './../../history';

const Error = ({ error }) => {
  if (error.message && error.errorCode) {
    return (
      <div className="error">
        <div className="error__message">{error.message}</div>
        <div className="error__code">{error.errorCode}</div>
        <button className="error__home" onClick={() => history.push('/')}>
          HomePage
        </button>
      </div>
    );
  } else {
    return '';
  }
};

const mapStateToProps = state => {
  return {
    error: state.error
  };
};
export default connect(mapStateToProps)(Error);
