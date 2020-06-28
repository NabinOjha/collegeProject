import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './JobDetails.scss';
import Spinner from './../Spinner/Spinner';

import { getJob, createApplication } from './../../actions/actions';

const JobDetails = ({ match, getJob, job, loading, createApplication }) => {
  useEffect(() => {
    getJob(match.params.id);
  }, []);

  const handleClick = () => {
    createApplication(job._id);
  };
  if (loading) {
    return <Spinner />;
  } else {
    return (
      job && (
        <div className="job-details">
          <div className="job-details-heading">
            <img
              className="job-details-heading__img"
              alt="job"
              src={`http://localhost:5000/img/${job.image}`}
            />
          </div>
          <div className="job-details-body">
            <div className="job-details-body-list">
              <h3 className="job-details-body__title">{job && job.name}</h3>
              <span>{job && job.createdBy && job.createdBy.companyName}</span>
              <h3 className="job-details-body__spec">Job Specification</h3>
              <li className="job-details-body-list__item">
                <span className="job-details-body-list__item-topic">
                  Salary:
                </span>
                <span className="job-details-body-list__item-desc">
                  RS: {job && job.salary}
                </span>
              </li>
              <li className="job-details-body-list__item">
                <span className="job-details-body-list__item-topic">
                  Address:
                </span>
                <span className="job-details-body-list__item-desc">
                  {job && job.address}
                </span>
              </li>
              <li className="job-details-body-list__item">
                <span className="job-details-body-list__item-topic">
                  Description:
                </span>
                <span className="job-details-body-list__item-desc">
                  {job && job.jobDescription}
                </span>
              </li>
            </div>
            <button className="job-details__button" onClick={handleClick}>
              Apply Now
            </button>
          </div>
        </div>
      )
    );
  }
};

const mapStateToProps = state => {
  return {
    job: state.job.currentJob,
    loading: state.loader.loading
  };
};

export default connect(mapStateToProps, { getJob, createApplication })(
  JobDetails
);
