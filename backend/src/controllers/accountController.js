import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import FoodLog from '../models/FoodLog.js';
import Exercise from '../models/Exercise.js';
import WaterLog from '../models/WaterLog.js';
import WeightLog from '../models/WeightLog.js';
import HealthScore from '../models/HealthScore.js';
import Feedback from '../models/Feedback.js';


export const changePassword = async (
  req,
  res,
  next
) => {
  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      req.user.id
    ).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      res.status(400);
      throw new Error(
        'Current password incorrect'
      );
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    res.json({
      message:
        'Password changed successfully',
    });

  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (
  req,
  res,
  next
) => {

  try {

    const userId = req.user.id;

    await Promise.all([
      FoodLog.deleteMany({ user: userId }),
      Exercise.deleteMany({ user: userId }),
      WaterLog.deleteMany({ user: userId }),
      WeightLog.deleteMany({ user: userId }),
      HealthScore.deleteMany({ user: userId }),
      Feedback.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.json({
      message:
        'Account deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};