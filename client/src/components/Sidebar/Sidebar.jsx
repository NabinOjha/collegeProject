import React from 'react';

import { connect } from 'react-redux';

import './Sidebar.scss';
import { REACT_APP_STATIC_IMAGE_PATH } from './../../static';

const Sidebar = props => {
  const sideBarItems = () => {
    if (props.user.loggedIn) {
      const { role } = props.user.currentUser;
      if (role === 'admin') {
        return [
          'JOBS',
          'EMPLOYEE',
          'EMPLOYER',
          'EDIT PROFILE',
          'EDIT PASSWORD',
          'POST A JOB',
          'MY Jobs',
          'CREATE JOB CATEGORY',
          'LOG OUT'
        ];
      } else if (role === 'employee') {
        return ['JOBS', 'EDIT PROFILE', 'EDIT PASSWORD', 'LOG OUT'];
      } else if (role === 'employer') {
        return [
          'JOBS',
          'POST A JOB',
          'EDIT PROFILE',
          'EDIT PASSWORD',
          'My Jobs',
          'EMPLOYEE',
          'LOG OUT'
        ];
      }
    } else return [];
  };
  const renderSidebarItem = (item, index) => (
    <li
      className="sidebar-nav-list__item active"
      key={index}
      onClick={props.handleClick}
    >
      {item}
    </li>
  );

  return (
    <div className="sidebar">
      <figure>
        {props.user &&
          props.user.currentUser &&
          props.user.currentUser.image && (
            <img
              src={`${REACT_APP_STATIC_IMAGE_PATH}/${props.user.currentUser.image}`}
              alt="user"
            />
          )}
        <figcaption>
          {props.user &&
            props.user.currentUser &&
            props.user.currentUser.userName}
        </figcaption>
        <span>
          {props.user &&
            props.user.currentUser &&
            props.user.currentUser.role.toUpperCase()}
        </span>
      </figure>

      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {sideBarItems().length > 0 &&
            sideBarItems().map((item, index) => {
              return renderSidebarItem(item, index);
            })}
        </ul>
      </nav>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Sidebar);
