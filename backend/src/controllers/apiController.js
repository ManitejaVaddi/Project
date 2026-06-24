import axios from 'axios';
import User from '../models/User.js';
import FoodLog from '../models/FoodLog.js';
import Exercise from '../models/Exercise.js';
import WaterLog from '../models/WaterLog.js';
import WeightLog from '../models/WeightLog.js';
import HealthScore from '../models/HealthScore.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';


// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY
// );

const getDateValue = (dateValue) => {
  return dateValue ? new Date(dateValue).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
};

const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return;

  const today = new Date()
    .toISOString()
    .split('T')[0];

  const yesterday = new Date(
    Date.now() - 86400000
  )
    .toISOString()
    .split('T')[0];

  if (!user.last_activity_date) {
    user.streak = 1;
  } else if (
    user.last_activity_date === today
  ) {
    return;
  } else if (
    user.last_activity_date === yesterday
  ) {
    user.streak += 1;
  } else {
    user.streak = 1;
  }

  user.last_activity_date = today;

  await user.save();
};

const estimateCalories = (profile = {}) => {
  let bmr = 2000;
  const gender = profile.gender?.toLowerCase();

  if (profile.age && profile.height_cm && profile.weight_kg && gender) {
    if (gender === 'male') {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
    }
  }

  if (profile.goal?.toLowerCase().includes('lose')) {
    return Math.round(bmr * 0.85);
  }
  if (profile.goal?.toLowerCase().includes('build') || profile.goal?.toLowerCase().includes('gain')) {
    return Math.round(bmr * 1.15);
  }
  return Math.round(bmr * 1.05);
};

const calculateHealthScore = (totals, waterIntakeMl, caloriesBurned, goals) => {
  const calorieGoal = goals.calories || 2000;
  const proteinGoal = goals.protein || 100;
  const carbsGoal = goals.carbs || 250;
  const fatGoal = goals.fat || 70;
  const fiberGoal = goals.fiber || 30;
  const waterGoal = goals.water || 2000;

  const calorieScore = Math.max(0, 100 - Math.min(100, Math.abs(totals.calories - calorieGoal) / calorieGoal * 100));
  const proteinScore = Math.min(100, (totals.protein / proteinGoal) * 100);
  const carbsScore = Math.min(100, (totals.carbs / carbsGoal) * 100);
  const fatScore = Math.min(100, (totals.fat / fatGoal) * 100);
  const fiberScore = Math.min(100, (totals.fiber / fiberGoal) * 100);
  const waterScore = Math.min(100, (waterIntakeMl / waterGoal) * 100);
  const activityScore = Math.min(100, (caloriesBurned / 300) * 100);

  const macroScore = (proteinScore + carbsScore + fatScore + fiberScore) / 4;
  const score = calorieScore * 0.35 + macroScore * 0.35 + waterScore * 0.2 + activityScore * 0.1;

  return Math.round(Math.max(0, Math.min(100, score)));
};

const buildDailySummary = async (user, date) => {
  const userId = user.id;
  const profile = await User.findById(userId).select('age gender height_cm weight_kg goal') || {};
  const caloriesGoal = estimateCalories(profile);
  const goals = {
    calories: caloriesGoal,
    protein: Math.round(caloriesGoal * 0.2 / 4),
    carbs: Math.round(caloriesGoal * 0.45 / 4),
    fat: Math.round(caloriesGoal * 0.3 / 9),
    fiber: 30,
    water: 2000,
  };

  const [meals, exercises, waterTotals, weightHistory] = await Promise.all([
    FoodLog.find({ user: userId, meal_date: date }).sort({ created_at: -1 }),
    Exercise.find({ user: userId, exercise_date: date }).sort({ created_at: -1 }),
    WaterLog.aggregate([
      { $match: { user: user._id, log_date: date } },
      { $group: { _id: null, total_ml: { $sum: '$amount_ml' } } },
    ]),
    WeightLog.find({ user: userId }).sort({ record_date: 1, created_at: 1 }).limit(30).select('record_date weight_kg'),
  ]);

  const totals = meals.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      acc.fiber += item.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const caloriesBurned = exercises.reduce((sum, item) => sum + item.calories_burned, 0);
  // Weekly Calories

const weeklyCalories = [];

for (let i = 6; i >= 0; i--) {

  const currentDate = new Date();

  currentDate.setDate(
    currentDate.getDate() - i
  );

  const dayString =
    currentDate
      .toISOString()
      .split('T')[0];

  const dayMeals =
    await FoodLog.find({
      user: userId,
      meal_date: dayString,
    });

  const dayCalories =
    dayMeals.reduce(
      (sum, meal) =>
        sum + meal.calories,
      0
    );

  weeklyCalories.push({
    day:
      currentDate.toLocaleDateString(
        'en-US',
        {
          weekday: 'short',
        }
      ),
    calories: dayCalories,
  });
}
  const waterIntakeMl = Number(waterTotals[0]?.total_ml) || 0;
  const dailyHealthScore = calculateHealthScore(totals, waterIntakeMl, caloriesBurned, goals);
  console.log('Meals:', meals.length);
console.log('Totals:', totals);
console.log('Water:', waterIntakeMl);
console.log('Exercise Calories:', caloriesBurned);
console.log('Score:', dailyHealthScore);

  await HealthScore.findOneAndUpdate(
    { user: userId, score_date: date },
    {
      score: dailyHealthScore,
      totals,
      waterIntakeMl,
      caloriesBurned,
      goals,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return {
  date,
  totals,
  meals,
  exercises,
  caloriesBurned,
  waterIntakeMl,
  weightHistory,
  latestWeight:
    weightHistory.at(-1) || null,
  goals,
  dailyHealthScore,

  weeklyCalories,
};
};

export const searchFood = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      res.status(400);
      throw new Error('Search query is required');
    }

    const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: process.env.USDA_API_KEY,
        query,
        pageSize: 12,
      },
    });

    res.json({ foods: response.data.foods || [] });
  } catch (error) {
    next(error);
  }
};

export const getDailySummary = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const summary = await buildDailySummary(req.user, date);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getHealthScore = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const summary = await buildDailySummary(req.user, date);
    res.json({
      date,
      score: summary.dailyHealthScore,
      totals: summary.totals,
      waterIntakeMl: summary.waterIntakeMl,
      caloriesBurned: summary.caloriesBurned,
      goals: summary.goals,
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthScoreHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 90);
    const scores = await HealthScore.find({ user: req.user.id }).sort({ score_date: -1 }).limit(limit);
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const meals = await FoodLog.find({ user: req.user.id, meal_date: date }).sort({ created_at: -1 });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};

export const getExercises = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const exercises = await Exercise.find({ user: req.user.id, exercise_date: date }).sort({ created_at: -1 });
    res.json(exercises);
  } catch (error) {
    next(error);
  }
};

export const getWaters = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const waters = await WaterLog.find({ user: req.user.id, log_date: date }).sort({ created_at: -1 });
    res.json(waters);
  } catch (error) {
    next(error);
  }
};

export const getWeights = async (req, res, next) => {
  try {
    const weights = await WeightLog.find({ user: req.user.id }).sort({ record_date: -1, created_at: -1 }).limit(30);
    res.json(weights);
  } catch (error) {
    next(error);
  }
};

export const addMeal = async (req, res, next) => {
  try {
    const {
      meal_date,
      meal_type,
      quantity,
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber,
    } = req.body;

    const meal = await FoodLog.create({
      user: req.user.id,

      meal_date: meal_date || getDateValue(),

      meal_type: meal_type || 'Breakfast',

      quantity: quantity || 100,

      name,

      calories,
      protein,
      carbs,
      fat,
      fiber,
    });
    await updateUserStreak(req.user.id);

    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

export const addExercise = async (req, res, next) => {
  try {
    const { exercise_date, activity, duration_minutes, calories_burned } = req.body;
    const exercise = await Exercise.create({
      user: req.user.id,
      exercise_date: exercise_date || getDateValue(),
      activity,
      duration_minutes,
      calories_burned,
    });
    await updateUserStreak(req.user.id);
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const addWater = async (req, res, next) => {
  try {
    const { log_date, amount_ml } = req.body;
    const water = await WaterLog.create({
      user: req.user.id,
      log_date: log_date || getDateValue(),
      amount_ml,
    });
    await updateUserStreak(req.user.id);
    res.status(201).json(water);
  } catch (error) {
    next(error);
  }
};

export const addWeight = async (req, res, next) => {
  try {
    const { record_date, weight_kg } = req.body;
    const weight = await WeightLog.create({
      user: req.user.id,
      record_date: record_date || getDateValue(),
      weight_kg,
    });
    await updateUserStreak(req.user.id);
    res.status(201).json(weight);
  } catch (error) {
    next(error);
  }
};

export const getNutritionAdvice = async (req, res) => {
  res.json({
    advice: 'Welcome to HealthOS AI Coach',
  });
};

export const askCoach = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: 'Question is required',
      });
    }

    const profile = await User.findById(req.user.id).select(
      'name age gender height_cm weight_kg goal'
    );

    const prompt = `
You are HealthOS AI Coach.

User Profile:
Name: ${profile?.name || 'User'}
Age: ${profile?.age || 'Unknown'}
Gender: ${profile?.gender || 'Unknown'}
Weight: ${profile?.weight_kg || 'Unknown'} kg
Goal: ${profile?.goal || 'Stay Healthy'}

User Question:
${question}

Give practical nutrition, fitness, diet and health advice.
Keep answers simple and beginner friendly.
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer =
      response.data.choices?.[0]?.message?.content ||
      'Unable to generate response.';

    res.json({
      answer,
    });
  } catch (error) {
    console.error('OPENROUTER ERROR:', error.response?.data || error);
    next(error);
  }
};
