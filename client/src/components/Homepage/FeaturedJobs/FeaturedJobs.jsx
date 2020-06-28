import React, { useEffect } from 'react';
import './FeaturedJobs.scss';
import { connect } from 'react-redux';

import JobItem from '../JobItem/JobItem';
import { Link } from 'react-router-dom';
import { getTrendingJobs } from './../../../actions/actions';

const FeaturedJobs = ({ jobs }) => {
  // useEffect(() => {
  //   getTrendingJobs();
  // }, []);

  return (
    <div className="jobs">
      <h2 className="jobs__heading">Trending Jobs</h2>
      {jobs.map((job, i) => {
        if (i < 5) {
          return <JobItem item={job} key={i} />;
        }
      })}
      <Link to="/jobs" className="jobs__more">
        Browse Jobs
      </Link>
    </div>
  );
};

// const mapStateToProps = state => {
//   return {
//     jobs: state.job.trendingJobs
//   };
// };

export default FeaturedJobs;
