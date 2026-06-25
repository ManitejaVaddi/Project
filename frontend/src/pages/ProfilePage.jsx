import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../api/userApi';
import { changePassword } from '../api/accountApi';
const calculateBMI = (height, weight) => {
  if (!height || !weight) return 0;

  const heightMeters = height / 100;

  return (
    weight /
    (heightMeters * heightMeters)
  ).toFixed(1);
};

const calculateBMR = (
  gender,
  age,
  height,
  weight
) => {
  if (!gender || !age || !height || !weight)
    return 0;

  if (gender.toLowerCase() === 'male') {
    return Math.round(
      10 * weight +
      6.25 * height -
      5 * age +
      5
    );
  }

  return Math.round(
    10 * weight +
    6.25 * height -
    5 * age -
    161
  );
};


const calculateWaterGoal = (weight) => {
  if (!weight) return 0;
  return Math.round(weight * 35);
};

const calculateProteinGoal = (weight) => {
  if (!weight) return 0;
  return Math.round(weight * 1.8);
};

const ProfilePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  });
  const [form, setForm] = useState({});

const [passwords, setPasswords] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      setForm(updated);
    },
  });
  const passwordMutation = useMutation({
  mutationFn: changePassword,
});

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Unable to load profile.</div>;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const bmi = calculateBMI(
  form.height_cm,
  form.weight_kg
);

const bmr = calculateBMR(
  form.gender,
  form.age,
  form.height_cm,
  form.weight_kg
);

const proteinGoal =
  calculateProteinGoal(form.weight_kg);

const waterGoal =
  calculateWaterGoal(form.weight_kg);

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      
      <h1 className="text-3xl font-semibold text-slate-900">Your profile</h1>
      <p className="mt-2 text-slate-500">Keep your personal goals and metrics up to date.</p>
      

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        

  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-sm text-slate-500">
      BMI
    </p>
    <p className="text-2xl font-bold">
      {bmi || '--'}
    </p>
  </div>

  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-sm text-slate-500">
      BMR
    </p>
    <p className="text-2xl font-bold">
      {bmr || '--'}
    </p>
  </div>

  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-sm text-slate-500">
      Protein Goal
    </p>
    <p className="text-2xl font-bold">
      {proteinGoal}g
    </p>
  </div>

  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="text-sm text-slate-500">
      Water Goal
    </p>
    <p className="text-2xl font-bold">
      {waterGoal} ml
    </p>
  </div>

</div>

      <div className="mb-6 rounded-xl bg-orange-50 p-5">
  <p className="text-sm text-orange-700">
    Current Streak
  </p>

  <p className="mt-2 text-4xl font-bold text-orange-600">
    🔥 {form.streak || 0} Days
  </p>
</div>

{/* Personal Information */}

<div className="mb-6 rounded-2xl border border-slate-200 p-6">

  <h2 className="mb-4 text-xl font-bold">
    Personal Information
  </h2>

  <div className="grid gap-4 md:grid-cols-2">

    <div>
      <p className="text-sm text-slate-500">
        Name
      </p>

      <p className="font-semibold">
        {form.name}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Email
      </p>

      <p className="font-semibold">
        {form.email}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Age
      </p>

      <p className="font-semibold">
        {form.age}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Gender
      </p>

      <p className="font-semibold">
        {form.gender}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Height
      </p>

      <p className="font-semibold">
        {form.height_cm} cm
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Weight
      </p>

      <p className="font-semibold">
        {form.weight_kg} kg
      </p>
    </div>

  </div>

</div>

<form
  className="mt-8 grid gap-4 md:grid-cols-2"
  onSubmit={handleSubmit}
>
 {[
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email', disabled: true },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'gender', label: 'Gender', type: 'text' },
  { key: 'height_cm', label: 'Height (cm)', type: 'number' },
  { key: 'weight_kg', label: 'Weight (kg)', type: 'number' },
  {
    key: 'target_weight_kg',
    label: 'Target Weight (kg)',
    type: 'number',
  },
  {
    key: 'activity_level',
    label: 'Activity Level',
    type: 'text',
  },
  {
    key: 'diet_type',
    label: 'Diet Type',
    type: 'text',
  },
  {
    key: 'goal',
    label: 'Goal',
    type: 'text',
  },
].map(({ key, label, type, disabled }) => (
          <label key={key} className="block">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              type={type}
              name={key}
              value={form[key] ?? ''}
              onChange={handleChange}
              disabled={disabled}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
        ))}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-white transition hover:bg-brand-600 disabled:opacity-70"
          >
            {mutation.isPending ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
        {mutation.isError && (
          <p className="md:col-span-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">Unable to update profile.</p>
        )}

</form>
        {/* Change Password */}

<div className="mt-8 rounded-2xl border border-slate-200 p-6">

  <h2 className="mb-4 text-xl font-bold">
    Change Password
  </h2>

 <input
  type="password"
  placeholder="Current Password"
  value={passwords.currentPassword}
  onChange={(e) =>
    setPasswords({
      ...passwords,
      currentPassword: e.target.value,
    })
  }
  className="mb-3 w-full rounded-xl border p-3"
/>

  <input
  type="password"
  placeholder="New Password"
  value={passwords.newPassword}
  onChange={(e) =>
    setPasswords({
      ...passwords,
      newPassword: e.target.value,
    })
  }
  className="mb-3 w-full rounded-xl border p-3"
/>

 <input
  type="password"
  placeholder="Confirm Password"
  value={passwords.confirmPassword}
  onChange={(e) =>
    setPasswords({
      ...passwords,
      confirmPassword: e.target.value,
    })
  }
  className="mb-3 w-full rounded-xl border p-3"
/>

 <button
  type="button"
  onClick={() => {
    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      alert('Passwords do not match');
      return;
    }

    passwordMutation.mutate({
      currentPassword:
        passwords.currentPassword,
      newPassword:
        passwords.newPassword,
    });
  }}
  className="rounded-xl bg-blue-600 px-5 py-3 text-white"
>
  Change Password
</button>

</div>

{/* Danger Zone */}

<div className="mt-8 rounded-2xl border border-red-200 p-6">

  <h2 className="text-xl font-bold text-red-600">
    Danger Zone
  </h2>

  <p className="mt-2 text-slate-500">
    This action cannot be undone.
  </p>

  <button
    className="mt-4 rounded-xl bg-red-600 px-5 py-3 text-white"
  >
    Delete Account
  </button>
  </div>
      
    </div>
  );
};

export default ProfilePage;
