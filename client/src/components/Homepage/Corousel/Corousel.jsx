import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './Corousel.scss';
import EmployerCardComponent from './EmployerCardComponent/EmployerCardComponent';

const Corousel = ({ employers }) => {
  return (
    <div className="corousel">
      <div className="text">
        <h2 className="text__heading">
          <b>Latest Employeers</b>
        </h2>
        <p className="text__description">
          Each Month, More Than 7 Million Jobhunt Turn To Website In Their
          Search For Work, Making{' '}
          <span>Over 160,000 Applications Every Day.</span>​
        </p>
      </div>
      <div className="card-slider" style={{ padding: '1rem' }}>
        {employers && employers.length > 0 && (
          <EmployerCardComponent employers={employers} />
        )}
      </div>
    </div>
  );
};

export default Corousel;
