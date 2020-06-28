import React from 'react';
import { connect } from 'react-redux';
import WorkIcon from '@material-ui/icons/Work';
import { Pagination } from '@material-ui/lab';

import './JobItem.scss';
import jobContext from './../../../context/jobContext';
import history from '../../../history';
import { deleteJob, createApplication } from './../../../actions/actions';

class JobItem extends React.Component {
  constructor(props) {
    super(props);
  }
  pathName = history.location.pathname;

  handleEditJob = id => {
    history.push(`/jobs/edit/${id}`);
  };

  handleDeleteJob = id => {
    this.props.deleteJob(id);
  };
  handleJobApplication = id => {
    this.props.createApplication(id);
  };

  renderButtonsBasedOnRole = (role, jobId) => {
    if (role === 'admin' || this.props.owner) {
      return (
        <React.Fragment>
          <button
            className=" dashboard__admin-btn dashboard__admin-btn--edit"
            onClick={e => {
              e.stopPropagation();
              this.handleEditJob(jobId);
            }}
          >
            Edit Job
          </button>
          <button
            className="dashboard__admin-btn dashboard__admin-btn--delete"
            onClick={e => {
              e.stopPropagation();
              this.handleDeleteJob(jobId);
            }}
          >
            Delete Job
          </button>
        </React.Fragment>
      );
    } else if (role === 'employer' && !this.owner) {
      return (
        <button
          className="job-item__btn"
          onClick={e => {
            e.stopPropagation();
            history.push(`/jobs/${jobId}`);
          }}
        >
          View Details
        </button>
      );
    } else {
      return (
        <button
          className="job-item__btn"
          onClick={e => {
            e.stopPropagation();
            this.handleJobApplication(jobId);
          }}
        >
          Apply Now
        </button>
      );
    }
  };

  render() {
    if (this.props.item) {
      return (
        <React.Fragment>
          <jobContext.Consumer>
            {value => {
              return (
                <div
                  className={`${
                    (value && value.split(' ')[0] === 'adminDashboard') ||
                    this.pathName === '/jobs'
                      ? 'dashboard'
                      : 'job-item'
                  }`}
                  onClick={() => {
                    history.push(`/jobs/${this.props.item._id}`);
                  }}
                >
                  <div className="job-item__title">
                    <i className="fa fa-user-md"></i>
                    <span className="job-item__title-text">
                      {this.props.item.name}
                    </span>
                  </div>
                  <div className="job-item__location">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <span className="job-item__location-text">
                      {this.props.item.address}
                    </span>
                  </div>
                  <div className="job-item__type">
                    {(value && value.split(' ')[0] === 'adminDashboard') ||
                    this.pathName === '/jobs' ? (
                      <WorkIcon
                        fontSize="small"
                        style={{ marginLeft: '-.2rem' }}
                      />
                    ) : null}

                    <span className="job-item__location-text">
                      {this.props.item.type}
                    </span>
                  </div>
                  <div className="job-item__salary">
                    <i className="fa fa-money"></i>
                    <span className="job-item__salary-text">
                      {this.props.item.salary}
                    </span>
                  </div>
                  <div className="job-item__deadline">
                    {`Application ends in :   `}
                    <span>
                      {this.props.item &&
                        this.props.item.deadline &&
                        this.props.item.deadline.split('T')[0]}
                    </span>
                  </div>

                  {this.renderButtonsBasedOnRole(
                    value && value.split(' ')[1],
                    this.props.item._id
                  )}
                </div>
              );
            }}
          </jobContext.Consumer>
          {this.props.match && this.props.match.url === '/jobs' ? (
            <Pagination
              classes={{ root: 'user-pagination' }}
              count={10}
              color="primary"
              defaultPage={1}
              size="large"
              variant="outlined"
            />
          ) : null}
        </React.Fragment>
      );
    }
  }
}

export default connect(null, { deleteJob, createApplication })(JobItem);
