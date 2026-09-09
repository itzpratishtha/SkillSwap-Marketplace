import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center bg-emerald-600 text-white p-12">

          <Link
            to="/"
            className="text-4xl font-bold tracking-tight"
          >
            SkillBridge
          </Link>

          <h2 className="text-3xl font-semibold mt-8">
            Learn. Teach. Grow Together.
          </h2>

          <p className="mt-5 text-emerald-100 leading-7">
            Connect with skilled learners and mentors.
            Earn credits by teaching, spend credits by learning,
            and grow together in a collaborative learning ecosystem.
          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <span>🎯</span>
              <span>Learn from experienced mentors</span>
            </div>

            <div className="flex items-center gap-3">
              <span>💳</span>
              <span>Earn and spend Skill Credits</span>
            </div>

            <div className="flex items-center gap-3">
              <span>📈</span>
              <span>Track your learning journey</span>
            </div>

          </div>

        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-8 md:p-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="md:hidden text-center mb-8">

              <Link
                to="/"
                className="text-3xl font-bold text-emerald-600"
              >
                SkillBridge
              </Link>

            </div>

            <Outlet />

          </div>

        </div>

      </div>
    </div>
  );
}