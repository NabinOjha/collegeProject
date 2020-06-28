//content matching cosine similarity algorihtm

const JobReviews = require('./../model/ratingsModel');
const consineSimilarity = require('./similarityScoreCosineSimilarity');

const createRatingBasedOnUserAction = async (
  action,
  currentUser,
  resume,
  job
) => {
  // const jobResumeResult = await compareUserAndJob(currentUser, jobId);
  try {
    const jobId = job._id;
    const similarity = consineSimilarity(currentUser, resume, [job]);
    const score = similarity[jobId];

    // destructure the score out of the result
    const userId = currentUser._id;
    // create the reviewObject
    const reviewObj = {};
    reviewObj.userId = userId;

    // create the array inside the review object that holds reviews for the jobs by certain user
    reviewObj.reviews = [];

    //insitialize the ratings object that holds reference of the jobId and the rating
    const ratingObj = {};
    ratingObj.job = jobId;
    if (action === 'click') {
      ratingObj.clickScore = score * 2;
    } else if (action === 'apply') {
      ratingObj.applyScore = score * 3;
    }

    reviewObj.reviews.push(ratingObj);
    const strgReviewObj = JSON.stringify(reviewObj);
    const jsonObj = JSON.parse(strgReviewObj);

    //find the reviews by the userId
    const reviewsByUser = await JobReviews.findOne({ userId: `${userId}` });

    //if user has not rated any jobs then create ratings based on that user
    if (reviewsByUser === null) {
      await JobReviews.create(jsonObj);
    } else {
      //if user has rated that specific job then dont rate again
      const checkTypeOfScoreExist = (item) => {
        if (action === 'click' && item.clickScore) {
          return true;
        } else if (action === 'apply' && item.applyScore) {
          return true;
        }
      };

      const ratedJob = reviewsByUser.reviews.find(
        (item) =>
          item.job.toString() === jobId.toString() &&
          checkTypeOfScoreExist(item)
      );

      if (ratedJob) {
        //if user has already rated the job return
        return;
      } else {
        //if user has not rated that job then push the rating fot that job into the reviews of the user
        await JobReviews.findOneAndUpdate(
          { userId: `${userId}` },
          {
            $push: { reviews: ratingObj },
          }
        );
      }
    }
  } catch (err) {
    //call next with error
    return { error: 'Failed to get the Job' };
  }
};

module.exports = createRatingBasedOnUserAction;
