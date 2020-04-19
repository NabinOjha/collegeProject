import React from 'react';
import { Card } from '@material-ui/core';
import { CardActionArea } from '@material-ui/core';
import { CardActions } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import { CardMedia } from '@material-ui/core';

import './Card.scss';

const UserCard = () => {
  return (
    <Card classes={{ root: 'User' }}>
      <CardActionArea>
        <CardMedia
          classes={{ root: 'User__image' }}
          style={{ backgroundPosition: 'left top' }}
        ></CardMedia>
        <CardContent classe={{ root: 'User-content' }}>
          <p className="User-content__name">Subina Tamang</p>
          <p className="User-content__desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            aspernatur fugit placeat nam natus iure.
          </p>
          <p className="User-content__category">Web developer</p>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <button className="User__btn">View Details</button>
      </CardActions>
    </Card>
  );
};

export default UserCard;
