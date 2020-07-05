import React from 'react';
import './CategoryItem.scss';

import history from './../../../../history';
import { REACT_APP_STATIC_IMAGE_PATH } from '../../../../static';

const CategoryItem = ({ data }) => {
  console.log(REACT_APP_STATIC_IMAGE_PATH);
  const currentIcon = `${REACT_APP_STATIC_IMAGE_PATH}/${data.icon}`;

  const handleClick = () => {
    history.push(`/categories/${data._id}`);
  };
  return (
    <div className="categoryItem" onClick={handleClick}>
      <div className="categoryItem__icon">
        {data.icon && (
          <img
            src={currentIcon}
            alt="category"
            style={{
              width: '3.5rem',
              height: '3.5rem',
              objectFit: 'cover'
            }}
          />
        )}
      </div>
      <div className="categoryItem__name">{data.name}</div>
      <div className="categoryItem__num">{`${data &&
        data.jobs &&
        data.jobs.length} jobs`}</div>
      <div className="categoryItem__anime">
        {data.icon && (
          <img
            src={currentIcon}
            alt="category"
            style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover' }}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
