import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './JobList.scss';
import JobItem from './../Homepage/JobItem/JobItem';
import Spinner from './../Spinner/Spinner';
import { getJobs, searchJobs } from './../../actions/actions';

const JobList = ({ jobs, getJobs, searchJobs, location, loading }) => {
  useEffect(() => {
    if (location.state) {
      searchJobs(location.state);
    } else {
      getJobs();
    }
  }, [location.state]);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div
        className="joblist"
        style={{
          display: 'grid',
          gridGap: '2rem',
          padding: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          marginTop: '2rem'
        }}
      >
        {jobs && jobs.map((job, i) => <JobItem item={job} key={i} />)}
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    jobs: state.job.jobs,
    loading: state.loader.loading
  };
};

export default connect(mapStateToProps, { getJobs, searchJobs })(JobList);
