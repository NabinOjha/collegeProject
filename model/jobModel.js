const mongoose = require('mongoose');
const Category = require('./jobCategoryModel');

const Schema = mongoose.Schema;

const jobsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  address: {
    type: String,
    required: [true, 'Please provide an address'],
  },
  salary: {
    type: String,
    required: [true, 'Please provide salary'],
  },
  category: String,
  type: String,
  education: String,
  jobDescription: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
  },
  application: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'JobApplication',
    },
  ],

  experience: String,
  deadline: Date,
  numPositions: Number,
  image: String,

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appliedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

jobsSchema.index({
  name: 'text',
  address: 'text',
  salary: 'text',
  category: 'text',
  type: 'text',
  experience: 'text',
  education: 'text',
  jobDescription: 'text',
});

jobsSchema.post('save', async function (doc) {
  const jobId = doc._id;
  await Category.findOneAndUpdate(
    { name: doc.category },
    { $push: { jobs: jobId } },
    { new: true }
  );
});

const Jobs = mongoose.model('Jobs', jobsSchema);

module.exports = Jobs;
