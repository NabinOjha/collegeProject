import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './CategoryListPage.scss';
import { getJobsByCategory } from './../../actions/actions';
import JobItem from '../Homepage/JobItem/JobItem';
import Spinner from '../Spinner/Spinner';

const CategoryListPage = ({ match, getJobsByCategory, category, loading }) => {
  useEffect(() => {
    getJobsByCategory(match.params.id);
  }, []);

  const renderJobs = () => {
    if (category && category.jobs && category.jobs.length > 0) {
      return category.jobs.map((job, index) => {
        return <JobItem key={index} item={job} />;
      });
    } else {
      return 'No Jobs Available in this category';
    }
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="categoryPageList">
        <h2 className="categoryPageList-title">{category && category.name}</h2>
        <div
          className={
            category && category.jobs && category.jobs.length === 0
              ? 'categoryPageList-empty-list'
              : 'categoryPageList-list'
          }
        >
          {renderJobs()}
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    category: state.job.activeCategory,
    loading: state.loader.loading
  };
};

export default connect(mapStateToProps, { getJobsByCategory })(
  CategoryListPage
);
