import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    goal: '',
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem('nutriai_token', data.token);
      navigate('/dashboard');
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Create your HealthOS account</h1>
        <p className="mt-2 text-slate-500">Set up your profile and start tracking nutrition, water, and exercise.</p>

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Goal</span>
            <input
              type="text"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Lose weight, build muscle, maintain"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Age</span>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Gender</span>
            <input
              type="text"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Height (cm)</span>
            <input
              type="number"
              name="height_cm"
              value={form.height_cm}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Weight (kg)</span>
            <input
              type="number"
              name="weight_kg"
              value={form.weight_kg}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-white transition hover:bg-brand-600 disabled:opacity-70"
            >
              {mutation.isPending ? 'Creating account...' : 'Register'}
            </button>
          </div>
          {mutation.isError && (
            <p className="md:col-span-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{mutation.error.message}</p>
          )}
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
