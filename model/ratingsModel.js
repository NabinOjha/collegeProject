const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      job: {
        type: mongoose.Types.ObjectId,
        ref: 'Job',
      },
      clickScore: Number,
      applyScore: Number,
    },
  ],
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
