import React from 'react';
import './userRole.scss';
import history from './../../../history';

const userRole = ({ bgColor, userRole }) => {
  const handleClick = role => {
    role = role.split(' ')[1];
    if (role === 'Employer') {
      history.push('/employerSignUp');
    } else if (role === 'Candidate') {
      history.push('/candidateSignUp');
    }
  };
  return (
    <React.Fragment>
      <div className={`userRole ${bgColor === 'black' ? 'black' : 'blue'}`}>
        <h2 className="userRole__text">I am {userRole}</h2>
        <p>
          Signed in companies are able to post new job offers, searching for
          candidate...
        </p>
        <button
          className={`userRole__btn ${
            bgColor === 'black' ? 'black-btn' : 'blue-btn'
          }`}
          onClick={e => handleClick(userRole)}
        >
          Create Account
        </button>
      </div>
    </React.Fragment>
  );
};

export default userRole;
