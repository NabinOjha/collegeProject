import React from 'react';
import { Card } from '@material-ui/core';
import { CardActionArea } from '@material-ui/core';
import { CardActions } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import { CardMedia } from '@material-ui/core';
import history from './../../history';

import './Card.scss';

const UserCard = ({ data }) => {
  const handleClick = () => {
    history.push(`/users/${data._id}`);
  };

  const renderDescription = () => {
    if (data.userDescription) {
      return data.userDescription.split('.')[0];
    } else if (data.companyDescription) {
      return data.companyDescription.split('.')[0];
    } else {
      return 'No details available!.Migh get some more in details page';
    }
  };
  return (
    <Card classes={{ root: 'User' }}>
      <CardActionArea style={{ cursor: 'auto' }}>
        <CardMedia
          classes={{ root: 'User__image' }}
          style={{
            backgroundPosition: 'center',
            backgroundImage: `url(http://localhost:5000/img/${data.image})`
          }}
          src={`url(http://localhost:5000/img/${data.image})`}
        ></CardMedia>
        <CardContent classe={{ root: 'User-content' }}>
          <p className="User-content__name">
            {data.userName ? data.userName : data.companyName}
          </p>
          <p className="User-content__desc">{renderDescription()}</p>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <button
          style={{ outline: 'none' }}
          className="User__btn"
          onClick={handleClick}
        >
          View Details
        </button>
      </CardActions>
    </Card>
  );
};

export default UserCard;
