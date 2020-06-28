import React from 'react';
import { Link } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { connect } from 'react-redux';
import { IoIosPerson } from 'react-icons/io';
import { getJobs, getUsers } from './../../actions/actions';

import Form from './../form/form';
import history from './../../history';
import { REACT_APP_STATIC_IMAGE_PATH } from './../../static';

import './Nav.scss';

class NavElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false
    };
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      open: !this.state.open
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    });
  };

  render() {
    let id;
    if (!(this.state.anchorEl === null)) {
      id = this.state.anchorEl.className;
    }
    const createPopOver = () => {
      return (
        <Popover
          id={id}
          classes={{
            root: 'root__el',
            paper: `popover ${
              id === 'login__handle' ? 'login-popover' : 'register-popover'
            }`
          }}
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Form formName={id} handleClose={this.handleClose} />
        </Popover>
      );
    };
    return (
      <nav>
        <ul
          className={` ${
            this.props.user && this.props.user.loggedIn
              ? 'user-nav-left'
              : 'nav--left'
          }`}
        >
          <li className="logo">
            {/* icon */}

            <p style={{ display: 'inline' }}>
              Work<span>Up</span>
            </p>
          </li>
          <li>
            <Link to="/" className="active">
              Home
            </Link>
          </li>
          <li>
            <Link to="/candidates">Candidates</Link>
          </li>
          <li>
            <Link to="/employers">Employers</Link>
          </li>
          <li>
            <Link to="/jobs">Jobs</Link>
          </li>
        </ul>
        {this.props.user && this.props.user.loggedIn ? (
          <div
            onClick={() => history.push('/dashboard')}
            className="user-nav-profile"
            style={{
              width: '30%',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '-1.2rem',
              cursor: 'pointer',
              paddingLeft: '1rem',
              justifyContent: 'flex-end'
            }}
            onClick={() => {
              this.props.getJobs();
              this.props.getUsers();
              history.push('/dashBoard');
            }}
          >
            <span
              className="user-nav-profile__name"
              style={{
                textTransform: 'uppercase',
                fontSize: '1rem',
                fontWeight: '400'
              }}
            >
              {this.props.user.currentUser.userName ||
                this.props.user.currentUser.companyName ||
                'User'}
            </span>
            {this.props.user.currentUser &&
            this.props.user.currentUser.image ? (
              <img
                src={`${REACT_APP_STATIC_IMAGE_PATH}/${this.props.user.currentUser.image}`}
                alt="nav"
                style={{
                  marginLeft: '.5rem',
                  height: '35px',
                  width: '35px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  padding: '.1rem'
                }}
              />
            ) : (
              <IoIosPerson
                style={{
                  marginLeft: '.5rem',
                  height: '25px',
                  width: '25px',
                  borderRadius: '50%',
                  background: '#0088FE',
                  padding: '.1rem'
                }}
              />
            )}
          </div>
        ) : (
          <ul className="nav--right">
            <li className="login">
              <div
                aria-describedby={id}
                variant="contained"
                onClick={this.handleClick}
                className="login__handle"
              >
                Login
              </div>
              {createPopOver()}
            </li>
            <li className="register">
              <div
                aria-describedby={id}
                variant="contained"
                onClick={this.handleClick}
                className="register__handle"
              >
                <i className="fa fa-sign-in"></i>Register
              </div>
            </li>
          </ul>
        )}
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, { getJobs, getUsers })(NavElement);
