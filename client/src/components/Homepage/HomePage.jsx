import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './homePage.scss';
import image from './img/homePage.svg';

import history from './../../history';
import UserRole from './userRoleBox/UserRole';
import FeaturedJobs from './FeaturedJobs/FeaturedJobs';
import Category from './Category/Category';
import Corousel from './Corousel/Corousel';
import {
  getTrendingJobs,
  getJobCategories,
  getEmployers,
  getJobs,
} from './../../actions/actions';
import Loader from './../Spinner/Spinner';

const HomePage = ({
  getTrendingJobs,
  trendingJobs,
  getJobCategories,
  categories,
  getEmployers,
  getJobs,
  employers,
  loader,
}) => {
  const [query, setQuery] = useState('');

  const fetchData = () => {
    getJobs();
    getTrendingJobs();
    getJobCategories();
    getEmployers();
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    history.push('/jobs', query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  if (loader) {
    return <Loader />;
  } else {
    return (
      <React.Fragment>
        <section className="homePage">
          <div className="homePage__primary">
            <h1 className="homePage__primary-heading">Find Perfect Jobs</h1>
            <p className="homePage__primary-paragraph">
              Grow your business with the top freelancing website.
            </p>
            <form className="homePage__search" onSubmit={handleSearch}>
              <i className="fa fa-pencil edit"></i>
              <input
                type="text"
                name="search"
                placeholder="Job Title or Keywords"
                value={query}
                onChange={handleChange}
              />
              <button className="submit">Find Jobs</button>
            </form>
          </div>
          <img
            className="homePage__image"
            id="homePage__hidden--image"
            src={image}
            alt="HomePage"
          />
        </section>

        <section className="homePage__role-box">
          <UserRole bgColor="blue" userRole="an Employer" />
          <UserRole bgColor="black" userRole="a Candidate" />
        </section>
        <section className="homePage__jobs-list">
          <FeaturedJobs jobs={trendingJobs} />
        </section>
        <section className="homePage__category">
          <Category categories={categories} />
        </section>
        <section className="homePage__company-corousel">
          <Corousel employers={employers} />
        </section>
        <footer
          className="footer"
          style={{
            textAlign: 'center',
            backgroundColor: '#21212F',
            padding: '4rem 1rem',
            color: '#fff',
          }}
        >
          Job Recommendation System @ Copyright
        </footer>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    trendingJobs: state.job.trendingJobs,
    categories: state.job.category,
    employers: state.user.employers,
    loader: state.loader.loading,
    jobs: state.job.jobs,
  };
};

export default connect(mapStateToProps, {
  getTrendingJobs,
  getJobCategories,
  getEmployers,
  getJobs,
})(HomePage);
