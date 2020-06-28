const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
    },
    icon: {
      type: String,
      required: [true, 'Please provide a category icon'],
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Categories', categorySchema);

module.exports = Category;
