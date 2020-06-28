import React from 'react';
import Slider from 'react-slick';
import { withSize } from 'react-sizeme';

import './EmployerCardComponent.scss';
import { REACT_APP_STATIC_IMAGE_PATH } from './../../../../static';

const EmployerCardComponent = ({ size, employers }) => {
  const findSlidesNumber = () => {
    if (size.width < 800 && size.width > 600) {
      return 2;
    } else if (size.width < 600) {
      return 1;
    }
    return 3;
  };

  let settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: findSlidesNumber(),
    slidesToScroll: findSlidesNumber(),
    autoplay: true,
    arrows: true
  };

  return (
    <div className="slider">
      <Slider {...settings}>
        {employers &&
          employers.map((employer, i) => {
            return (
              <div key={i}>
                <div className="employer-card">
                  <div className="employer-card-img-wrapper">
                    <img
                      className="employer-card-img-wrapper__img"
                      src={`${REACT_APP_STATIC_IMAGE_PATH}/${employer.image}`}
                      alt="logo"
                    />
                  </div>
                  <h3 className="employer-card__title">
                    {employer.userName || employer.companyName || 'Employer'}
                  </h3>
                  <p className="employer-card__location">
                    {employer.companyAddress || 'Nepal'}
                  </p>
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
};

export default withSize()(EmployerCardComponent);
