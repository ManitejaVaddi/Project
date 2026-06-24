import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <h1 className="text-3xl font-bold text-emerald-600">
            HealthOS
          </h1>

          <div className="hidden gap-8 md:flex">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-xl px-5 py-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-emerald-500 px-5 py-2 text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                 Your Daily Health Companion
              </span>

              <h1 className="mt-6 text-6xl font-bold leading-tight text-slate-900">
                Take Control Of
                <span className="block text-emerald-600">
                  Your Health
                </span>
              </h1>

              <p className="mt-6 text-xl text-slate-600">
                Track nutrition, water intake,
                workouts, body weight and get
                AI-powered health insights.
                Your personal health OS — nutrition, fitness, and wellness in one place.
              </p>

              <div className="mt-8 flex gap-4">

                <Link
                  to="/register"
                  className="rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-white"
                >
                  Start Free
                </Link>

                <Link
                  to="/login"
                  className="rounded-2xl border px-8 py-4 font-semibold"
                >
                  Login
                </Link>

              </div>

            </div>

            {/* Hero Image */}

            <div>

              <img
                src="/dashboard-preview.png"
                alt="dashboard"
                className="rounded-3xl shadow-2xl"
              />

            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24"
      >

        <h2 className="text-center text-4xl font-bold">
          Everything You Need
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          <FeatureCard
            icon="🍽️"
            title="Nutrition Tracking"
            desc="Track calories, protein, carbs and fats."
          />

          <FeatureCard
            icon="💧"
            title="Water Monitoring"
            desc="Stay hydrated and hit your goals."
          />

          <FeatureCard
            icon="🏋️"
            title="Workout Logs"
            desc="Monitor daily exercises and calories burned."
          />

          <FeatureCard
            icon="🤖"
            title="AI Health Coach"
            desc="Get personalized fitness guidance."
          />

        </div>

      </section>

      {/* How It Works */}

      <section
        id="how"
        className="bg-slate-50 py-24"
      >

        <div className="mx-auto max-w-6xl px-6">

          <h2 className="text-center text-4xl font-bold">
            How It Works
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">

            <Step
              number="1"
              title="Create Account"
              desc="Sign up and create your health profile."
            />

            <Step
              number="2"
              title="Track Daily Habits"
              desc="Add meals, water and workouts."
            />

            <Step
              number="3"
              title="Get Insights"
              desc="View progress and AI recommendations."
            />

          </div>

        </div>

      </section>

      {/* AI Coach */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-12 text-white">

          <h2 className="text-5xl font-bold">
            Your Personal AI Coach
          </h2>

          <p className="mt-4 text-xl">
            Ask nutrition questions,
            get workout suggestions,
            and improve your health.
          </p>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-slate-950 py-24 text-center text-white">

        <h2 className="text-5xl font-bold">
          Start Your Health Journey Today
        </h2>

        <p className="mt-4 text-slate-300">
          Join HealthOS and transform your lifestyle.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-block rounded-2xl bg-emerald-500 px-10 py-4 font-semibold text-white"
        >
          Create Free Account
        </Link>

      </section>

      {/* Footer */}

      <footer
        id="contact"
        className="bg-slate-900 px-6 py-12 text-white"
      >

        <div className="mx-auto max-w-7xl">

          <h3 className="text-2xl font-bold text-emerald-500">
            HealthOS
          </h3>

          <div className="mt-6">
            <p> Suggest feeback from your created account</p>

            <p>Admin: Venkata Maniteja</p>
            
            

          </div>

        </div>

      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
    <div className="text-5xl">{icon}</div>
    <h3 className="mt-4 text-xl font-bold">{title}</h3>
    <p className="mt-3 text-slate-600">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="rounded-3xl bg-white p-8 shadow-sm">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
      {number}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="mt-2 text-slate-600">{desc}</p>
  </div>
);

export default LandingPage;