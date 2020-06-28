import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './Category.scss';
import CategoryItem from './CategoryItem/CategoryItem';
import Spinner from './../../Spinner/Spinner';
import { getJobCategories } from './../../../actions/actions';
import history from './../../../history';
import { useState } from 'react';

const Category = ({ categories, getJobCategories }) => {
  const { pathname } = history.location;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/categories') {
      getJobCategories();
    }
    setLoading(false);
  }, []);
  const handleCLick = e => {
    history.push('/categories');
  };

  const renderCategories = () => {
    if (categories.length > 0) {
      if (pathname === '/categories') {
        return categories.map((category, index) => {
          return <CategoryItem key={index} data={category} />;
        });
      } else {
        return categories
          .filter((category, index) => index < 6)
          .map((category, index) => (
            <CategoryItem key={index} data={category} />
          ));
      }
    }
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="category">
        <div className="category__heading">
          <h2 className="category__heading--text">Browse By Category</h2>
          <p className="category__heading--desc">
            Each month, more than 7 million Jobhunt turn to website in their
            search for work, making over
            <span>160,000 applications every day.</span>
          </p>
        </div>
        <div className="category__list">{renderCategories()}</div>
        {pathname !== '/categories' ? (
          <button className="category__browse" onClick={handleCLick}>
            Browse Category
          </button>
        ) : null}
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    categories: state.job.category
  };
};

export default connect(mapStateToProps, { getJobCategories })(Category);
