const scoreBasedOnBehaviour = require('./../utils/scoreBasedOnBehaviour');
const Jobs = require('./../model/jobModel');
const Ratings = require('./../model/ratingsModel');
const User = require('./../model/userModel');
const Categories = require('./../model/jobCategoryModel');
const parseResume = require('./../utils/parseResume');
const similarityScoreJobs = require('./../utils/similarityScoreCosineSimilarity');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');

const sendResponse = (res, data) => {
  res.status(201).json(data);
};

exports.createJob = catchAsync(async (req, res, next) => {
  const body = {
    ...req.body,
  };

  if (req.files) {
    for (let [key, value] of Object.entries(req.files)) {
      body[key] = value[0].filename;
    }
  }
  if (req.file) body.image = req.file.filename;
  const createdBy = req.user.id;
  body.createdBy = createdBy;

  const job = await Jobs.create(body);

  sendResponse(res, job);
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  if (req.jobs) {
    const jobs = req.jobs;
    return sendResponse(res, jobs);
  } else if (!req.jobs && req.user && req.user.resume) {
    const resumeCallback = async (data) => {
      const jobsCollection = await Jobs.find().select({
        appliedBy: 0,
        application: 0,
      });
      const sortedJobsByScore = await similarityScoreJobs(
        req.user,
        data,
        jobsCollection
      );
      const jobs = [];
      for (let [key, value] of Object.entries(sortedJobsByScore)) {
        const job = await Jobs.findById(key);
        jobs.push(job);
      }

      if (!jobs) {
        const jobs = await Jobs.find().select({
          appliedBy: 0,
          application: 0,
        });
        return sendResponse(res, jobs);
      }

      return sendResponse(res, jobs);
    };
    await parseResume(req.user.resume, resumeCallback);
    //   //find the jobs based on similarity between the jobs and resume and send the resposne by sorting the jobs
  } else {
    const jobs = await Jobs.find().select({ application: 0, appliedBy: 0 });
    if (!jobs) return next(new AppError('Jobs not Found!', 404));
    return sendResponse(res, jobs);

    //send the jobs as they are retrieved
  }
});

exports.getOneJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  //check if user exist if user exist calculate similarity score else just send back the job
  if (req.user) {
    const job = await Jobs.findById(id)
      .select({
        appliedBy: 0,
        application: 0,
      })
      .populate('createdBy');

    const resumeCallback = async (data) => {
      await scoreBasedOnBehaviour('click', req.user, data, job);
      sendResponse(res, job);
    };

    const resume = req.user.resume;
    if (!resume) {
      return sendResponse(res, job);
    }
    parseResume(req.user.resume, resumeCallback);
  } else {
    const job = await Jobs.findById(id).populate('createdBy');
    if (!job) return next(new AppError('Job not Found!.', 404));
    sendResponse(res, job);
  }
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedJob = await Jobs.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  }).select({ application: 0, appliedBy: 0 });
  if (!updatedJob) return next(new AppError('Job could not be updated', 404));
  sendResponse(res, updatedJob);
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Jobs.findByIdAndDelete(id);
  await Categories.findOneAndUpdate({ jobs: id }, { $pull: { jobs: id } });

  res.status(200).json({
    message: 'success',
  });
});

exports.trendingJobs = catchAsync(async (req, res, next) => {
  const jobs = await Jobs.find();
  const trendingJobs = await Jobs.aggregate([
    {
      $project: {
        numApplication: { $size: { $ifNull: ['$application', []] } },
        name: 1,
        salary: 1,
        address: 1,
        type: 1,
        deadline: 1,
      },
    },
    {
      $sort: { numApplication: -1 },
    },
  ]);
  if (!trendingJobs) {
    const jobs = await Jobs.find().select({ application: 0, appliedBy: 0 });
    if (!jobs) return next(new AppError('Trending jobs not found!', 404));
    return sendResponse(res, jobs);
  }
  sendResponse(res, trendingJobs);
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Categories.find({});
  if (!categories) return next(new AppError('Categories not found!', 404));
  sendResponse(res, categories);
});

exports.getRatingsDataOfJobsForEachUser = catchAsync(async (req, res, next) => {
  const ratings = await Ratings.find();

  if (!ratings || ratings.length === 0) {
    return next();
  }
  const userRatingObj = {};

  //loop through every rating and assign reviews based on email
  for (let rating of ratings) {
    const user = await User.findById(rating.userId);
    userRatingObj[user.email] = rating;
  }

  //loop through every rating in userRatingObj
  for (let [key, value] of Object.entries(userRatingObj)) {
    const ratingObj = {};
    const currentRatingObj = value;

    //assign userId to the ratinObj
    ratingObj.userId = value.userId;

    //compare JobId to calculate the total rating
    for (let i = 0; i < currentRatingObj.reviews.length; i++) {
      const jobIdStr = `${currentRatingObj.reviews[i].job}`;
      let score = 0;
      for (let j = 0; j < currentRatingObj.reviews.length; j++) {
        const jobIdToCompare = `${currentRatingObj.reviews[j].job}`;
        if (jobIdStr === jobIdToCompare) {
          if (currentRatingObj.reviews[j].clickScore) {
            score = score + currentRatingObj.reviews[j].clickScore;
          } else if (currentRatingObj.reviews[j].applyScore) {
            score = score + currentRatingObj.reviews[j].applyScore;
          }
        }
      }
      ratingObj[currentRatingObj.reviews[i].job] = score;
    }

    userRatingObj[key] = ratingObj;
  }

  const jobs = await Jobs.find({});
  jobs.map((job) => {
    for (let [key, value] of Object.entries(userRatingObj)) {
      if (!value[job._id]) {
        value[job._id] = null;
      }
    }
  });
  req.reviews = userRatingObj;

  next();
});

//user based collabrative filtering using KNN algorithm
exports.getRecommededJobs = catchAsync(async (req, res, next) => {
  let reviews = req.reviews;

  if (!reviews) {
    return next();
  }
  const currentUser = req.user;
  if (!currentUser) return next();
  const simlilarityScoresObj = {};

  //find the rating provided by the currentUser
  const currentUserRatings = reviews[currentUser.email];

  //if user has not rated any jobs, no recommndations can be genereated
  if (!currentUserRatings) {
    return next();
  }

  //remove the extra fields except for the job rating
  let jobs = Object.keys(currentUserRatings);
  const indexOfUserId = jobs.indexOf('userId');
  jobs.splice(indexOfUserId, 1);

  //2.calculate similarity  based on rating by currentUser and other user
  //with euclidean distance formula: c^2 = a^2+b^2;
  const calculateSimilarity = (otherUserEmail, currentUserEmail) => {
    currentUserRating = reviews[currentUserEmail];
    otherUserRating = reviews[otherUserEmail];
    let sumSquares = 0;
    jobs.map((job) => {
      rating_1 = currentUserRating[job];
      rating_2 = otherUserRating[job];
      if (rating_1 !== null && rating_2 !== null) {
        let difference;
        //difference represents how dissimilar user are based on their ratings ...The larger the difference the more dissimilar their interests are
        difference = rating_2 - rating_1;
        if (difference !== 0) {
          sumSquares = sumSquares + difference * difference;
        }
      }
    });

    if (sumSquares !== 0) {
      let distance = 1 / Math.sqrt(sumSquares);
      return distance;
    }
  };

  //1.loop through ratings of each user and calculate similarity of curentuser and every other user
  for (let [key, value] of Object.entries(reviews)) {
    if (key !== currentUser.email) {
      const similarity = calculateSimilarity(key, currentUser.email);
      if (similarity) {
        simlilarityScoresObj[key] = similarity;
      }
    }
  }

  if (Object.keys(simlilarityScoresObj).length === 0) return next();

  //3.sort the users based on their similarity scores
  const sortableArray = [];
  for (let similarity in simlilarityScoresObj) {
    sortableArray.push([similarity, simlilarityScoresObj[similarity]]);
  }

  sortableArray.sort((a, b) => {
    return b[1] - a[1];
  });

  let sortedUsers = {};
  for (let user of sortableArray) {
    sortedUsers[user[0]] = user[1];
  }

  //3.predict rating of jobs for currentUser which he has not rated yet
  // based on the ratings provided by its nearest neighbours
  const nearestNeighbours = [];
  const scores = [];
  for (let [key, value] of Object.entries(sortedUsers)) {
    nearestNeighbours.push(key);
    scores.push(value);
  }

  const finalRecommededJobsWithoutSort = {};
  jobs.map((job) => {
    let weightedSum = 0;
    let scoreSum = 0;

    // if (currentUserRatings[job] === null) {
    //define k neighbours for large number of users
    for (let i = 0; i < nearestNeighbours.length; i++) {
      const userRatings = reviews[nearestNeighbours[i]];
      const score = scores[i];
      const rating = userRatings[job];
      weightedSum = (weightedSum + rating) * score;
      scoreSum = scoreSum + score;
    }
    // }
    let jobScore;
    if (weightedSum !== 0) {
      jobScore = weightedSum / scoreSum;
      finalRecommededJobsWithoutSort[job] = jobScore;
    }
  });

  const sortableRecommendations = [];
  //if nearest neighbours has not rated any jobs current user has not rated then it is not possible to recccommend any jobs with this algorithm
  if (Object.keys(finalRecommededJobsWithoutSort).length === 0) return next();

  for (let recommedation in finalRecommededJobsWithoutSort) {
    sortableRecommendations.push([
      recommedation,
      finalRecommededJobsWithoutSort[recommedation],
    ]);
  }

  sortableRecommendations.sort((a, b) => {
    return b[1] - a[1];
  });

  sortedRecommedationObj = {};
  sortableRecommendations.map((recommedation) => {
    sortedRecommedationObj[recommedation[0]] = recommedation[1];
  });

  //make a list of recommended jobs
  const finalRecommndations = [];
  for (let [key, value] of Object.entries(sortedRecommedationObj)) {
    const job = await Jobs.findById(key);
    finalRecommndations.push(job);
  }

  //4.manage the jobs collection based on the ratings generated by KNN algorithm
  const jobsCollection = await Jobs.find();
  const recommedationLength = finalRecommndations.length;
  const recommedationCategory = `${finalRecommndations[0].category}`;

  for (i = 0; i < jobsCollection.length; i++) {
    const inclued = finalRecommndations.some(
      (job) => `${job._id}` === `${jobsCollection[i]._id}`
    );

    if (
      !inclued &&
      !recommedationCategory
        .split(' ')
        .includes(`${jobsCollection[i].category}`.split(' ')[0])
    ) {
      finalRecommndations.push(jobsCollection[i]);
    } else if (
      !inclued &&
      recommedationCategory
        .split(' ')
        .includes(`${jobsCollection[i].category}`.split(' ')[0])
    ) {
      finalRecommndations.splice(recommedationLength, 0, jobsCollection[i]);
    }
  }

  req.jobs = finalRecommndations;
  next();
});

exports.searchJobs = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  const releventResult = await Jobs.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  if (!releventResult)
    return next(new AppError('No jobs available matching your query', 404));
  sendResponse(res, releventResult);
});
