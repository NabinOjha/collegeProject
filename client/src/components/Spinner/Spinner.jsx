import React from 'react';

import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import './Spinner.scss';

const Spinner = () => {
  return (
    <div className="loader">
      <Loader
        type="Bars"
        color="#0088FE"
        height={150}
        width={150}
        timeout={5000}
      />
    </div>
  );
};

export default Spinner;
