import Feedback from '../models/Feedback.js';

export const createFeedback = async (
  req,
  res,
  next
) => {
  try {
    const { subject, message } = req.body;

    const feedback =
      await Feedback.create({
        user: req.user.id,
        subject,
        message,
      });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (
  req,
  res,
  next
) => {
  try {
    const feedbacks =
      await Feedback.find()
        .populate(
          'user',
          'name email'
        )
        .sort({
          created_at: -1,
        });

    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};
export const markFeedbackReviewed = async (
  req,
  res,
  next
) => {
  try {

    console.log(
      'Feedback ID:',
      req.params.id
    );

    const feedback =
      await Feedback.findById(
        req.params.id
      );

    console.log(
      'Feedback Found:',
      feedback
    );

    if (!feedback) {
      res.status(404);
      throw new Error(
        'Feedback not found'
      );
    }

    feedback.status = 'Reviewed';

    feedback.reviewedAt =
      new Date();

    if (req.body.reply) {
      feedback.adminReply =
        req.body.reply;
    }

    await feedback.save();

    res.json(feedback);

  } catch (error) {
    console.log(error); // add this too
    next(error);
  }
};
export const getMyFeedbacks = async (
  req,
  res,
  next
) => {
  try {
    const feedbacks = await Feedback.find({
      user: req.user.id,
    }).sort({
      created_at: -1,
    });

    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};