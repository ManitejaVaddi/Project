import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";
import {
  addExercise,
  addMeal,
  addWater,
  addWeight,
  getExercises,
  getMeals,
  getWaterLogs,
  getWeightHistory,
} from '../api/userApi';
import LogList from '../components/tracking/LogList';
import TrackingForm from '../components/tracking/TrackingForm';
import { getToday } from '../utils/date';

const numberValue = (value) => Number(value || 0);

const TrackingPage = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
  const [exerciseForm, setExerciseForm] = useState({ activity: '', duration_minutes: '', calories_burned: '' });
  const [waterForm, setWaterForm] = useState({ amount_ml: '' });
  const [weightForm, setWeightForm] = useState({ weight_kg: '' });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['meals'] });
    queryClient.invalidateQueries({ queryKey: ['exercises'] });
    queryClient.invalidateQueries({ queryKey: ['waters'] });
    queryClient.invalidateQueries({ queryKey: ['weights'] });
    queryClient.invalidateQueries({ queryKey: ['health-scores'] });
  };

  const { data: meals = [] } = useQuery({ queryKey: ['meals', selectedDate], queryFn: () => getMeals(selectedDate), retry: false });
  const { data: exercises = [] } = useQuery({ queryKey: ['exercises', selectedDate], queryFn: () => getExercises(selectedDate), retry: false });
  const { data: waters = [] } = useQuery({ queryKey: ['waters', selectedDate], queryFn: () => getWaterLogs(selectedDate), retry: false });
  const { data: weights = [] } = useQuery({ queryKey: ['weights'], queryFn: getWeightHistory, retry: false });

  const mealMutation = useMutation({
    mutationFn: addMeal,
    onSuccess: () => {
      toast.success("Meal added successfully ");
      setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
      refreshData();
    },
  });
  const exerciseMutation = useMutation({
    mutationFn: addExercise,
    onSuccess: () => {
      toast.success("Workout logged ");
      setExerciseForm({ activity: '', duration_minutes: '', calories_burned: '' });
      refreshData();
    },
  });
  const waterMutation = useMutation({
    mutationFn: addWater,
    onSuccess: () => {
       toast.success("Water intake saved ");
      setWaterForm({ amount_ml: '' });
      refreshData();
    },
  });
  const weightMutation = useMutation({
    mutationFn: addWeight,
    onSuccess: () => {
      console.log("SUCCESS CALLED");

      toast.success("Weight updated ");
      setWeightForm({ weight_kg: '' });
      refreshData();
    },
  });

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  };

  const groupedMeals = {
  Breakfast: meals.filter(
    (meal) => meal.meal_type === 'Breakfast'
  ),

  Lunch: meals.filter(
    (meal) => meal.meal_type === 'Lunch'
  ),

  Dinner: meals.filter(
    (meal) => meal.meal_type === 'Dinner'
  ),

  Snack: meals.filter(
    (meal) => meal.meal_type === 'Snack'
  ),
};

const totals = meals.reduce(
  (acc, meal) => {
    acc.calories += meal.calories || 0;
    acc.protein += meal.protein || 0;
    acc.carbs += meal.carbs || 0;
    acc.fat += meal.fat || 0;
    acc.fiber += meal.fiber || 0;

    return acc;
  },
  {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  }
);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-brand-700">HealthOS Tracking</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">Food, exercise, water, and weight logs</h1>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-600">
          Log date
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2" />
        </label>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <TrackingForm
          title="Food Tracking"
          fields={[
            { name: 'name', label: 'Food name', placeholder: 'Greek yogurt' },
            { name: 'calories', label: 'Calories', type: 'number', min: 0 },
            { name: 'protein', label: 'Protein (g)', type: 'number', min: 0 },
            { name: 'carbs', label: 'Carbs (g)', type: 'number', min: 0 },
            { name: 'fat', label: 'Fat (g)', type: 'number', min: 0 },
            { name: 'fiber', label: 'Fiber (g)', type: 'number', min: 0 },
          ]}
          values={mealForm}
          onChange={updateForm(setMealForm)}
          submitLabel="Add food"
          isSaving={mealMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            mealMutation.mutate({
              meal_date: selectedDate,
              name: mealForm.name,
              calories: numberValue(mealForm.calories),
              protein: numberValue(mealForm.protein),
              carbs: numberValue(mealForm.carbs),
              fat: numberValue(mealForm.fat),
              fiber: numberValue(mealForm.fiber),
            });
          }}
        />

        <TrackingForm
          title="Exercise Tracking"
          fields={[
            { name: 'activity', label: 'Activity', placeholder: 'Cycling' },
            { name: 'duration_minutes', label: 'Duration (min)', type: 'number', min: 0 },
            { name: 'calories_burned', label: 'Calories burned', type: 'number', min: 0 },
          ]}
          values={exerciseForm}
          onChange={updateForm(setExerciseForm)}
          submitLabel="Add exercise"
          isSaving={exerciseMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            exerciseMutation.mutate({
              exercise_date: selectedDate,
              activity: exerciseForm.activity,
              duration_minutes: numberValue(exerciseForm.duration_minutes),
              calories_burned: numberValue(exerciseForm.calories_burned),
            });
          }}
        />

        <TrackingForm
          title="Water Tracking"
          fields={[{ name: 'amount_ml', label: 'Amount (ml)', type: 'number', min: 0, placeholder: '500' }]}
          values={waterForm}
          onChange={updateForm(setWaterForm)}
          submitLabel="Log water"
          isSaving={waterMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            waterMutation.mutate({ log_date: selectedDate, amount_ml: numberValue(waterForm.amount_ml) });
          }}
        />

        <TrackingForm
          title="Weight Tracking"
          fields={[{ name: 'weight_kg', label: 'Weight (kg)', type: 'number', min: 0, step: '0.1', placeholder: '72.5' }]}
          values={weightForm}
          onChange={updateForm(setWeightForm)}
          submitLabel="Log weight"
          isSaving={weightMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            weightMutation.mutate({ record_date: selectedDate, weight_kg: numberValue(weightForm.weight_kg) });
          }}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-5">

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-slate-500">Calories</p>
    <p className="text-2xl font-bold">
      {totals.calories}
    </p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-slate-500">Protein</p>
    <p className="text-2xl font-bold">
      {totals.protein}g
    </p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-slate-500">Carbs</p>
    <p className="text-2xl font-bold">
      {totals.carbs}g
    </p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-slate-500">Fat</p>
    <p className="text-2xl font-bold">
      {totals.fat}g
    </p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-slate-500">Fiber</p>
    <p className="text-2xl font-bold">
      {totals.fiber}g
    </p>
  </div>

</div>

      <div className="grid gap-6 lg:grid-cols-2">
        {<div className="space-y-4">

  {Object.entries(groupedMeals).map(
    ([mealType, items]) => (
      <div
        key={mealType}
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <h3 className="mb-3 text-lg font-bold">
          {mealType}
        </h3>

        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No meals logged
          </p>
        ) : (
          items.map((meal) => (
            <div
              key={meal.id}
              className="mb-3 rounded-lg bg-slate-50 p-3"
            >
              <div className="flex justify-between">
                <span className="font-semibold">
                  {meal.name}
                </span>

                <span>
                  {meal.calories} kcal
                </span>
              </div>

              <div className="mt-2 text-sm text-slate-600">
                Protein {meal.protein}g •
                Carbs {meal.carbs}g •
                Fat {meal.fat}g •
                Fiber {meal.fiber}g
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Quantity: {meal.quantity || 100}g
              </div>
            </div>
          ))
        )}
      </div>
    )
  )}

</div>}

        <LogList
          title="Today's Exercise"
          emptyText="No exercise logged for this date."
          items={exercises}
          renderItem={(exercise) => (
            <div key={exercise.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{exercise.activity}</p>
                <p className="text-sm text-slate-500">{exercise.calories_burned} kcal</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{exercise.duration_minutes} minutes</p>
            </div>
          )}
        />

        <LogList
          title="Today's Water"
          emptyText="No water logged for this date."
          items={waters}
          renderItem={(water) => (
            <div key={water.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{water.amount_ml} ml</p>
              <p className="mt-1 text-sm text-slate-500">{water.log_date}</p>
            </div>
          )}
        />

        <LogList
          title="Recent Weight"
          emptyText="No weight records yet."
          items={weights}
          renderItem={(weight) => (
            <div key={weight.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{weight.weight_kg} kg</p>
                <p className="text-sm text-slate-500">{weight.record_date}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TrackingPage;
