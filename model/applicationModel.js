const mongoose = require('mongoose');

const Job = require('./jobModel');
const User = require('./userModel');
const scoreBasedOnBehaviour = require('../utils/scoreBasedOnBehaviour');
const Email = require('../utils/sendMail');
const Schema = mongoose.Schema;
const parseResume = require('../utils/parseResume');
const AppError = require('../utils/catchAsync');

const jobApplicationSchema = new Schema(
  {
    employer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    employee: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
    },
  },

  {
    timestamps: true,
  }
);

//push the id of the application into job application field whenever the application is saved
jobApplicationSchema.pre('save', async function (next) {
  try {
    //query sender,receive and jobName
    const emailSender = await User.findById(this.employee);
    const emailReceiver = await User.findById(this.employer);
    const job = await Job.findById(this.jobId);
    const jobName = job.name;

    //send mail to the receiver
    await new Email(
      emailSender,
      emailReceiver,
      `Applying for the ${jobName} position.`
    ).send();

    const updatedJob = await Job.findByIdAndUpdate(this.jobId, {
      // $push: { application: this.id },
      $push: {
        appliedBy: this.employee,
      },
    });

    const resumeCallback = async (data) => {
      await scoreBasedOnBehaviour('apply', emailSender, data, job);
    };
    //send user resume and job not ids or next
    await parseResume(emailSender.resume, resumeCallback);

    next();
  } catch (err) {
    next(
      new AppError(
        'Something went wrong while sending mail and parsing resume!',
        500
      )
    );
  }
});

jobApplicationSchema.post('save', async function (doc, next) {
  try {
    await Job.findByIdAndUpdate(doc.jobId, {
      $push: {
        application: doc.id,
      },
    });

    next();
  } catch (err) {
    next(new AppError('Job update failed!', 500));
  }
});

const JobApplicationModel = mongoose.model(
  'JobApplication',
  jobApplicationSchema
);

module.exports = JobApplicationModel;
