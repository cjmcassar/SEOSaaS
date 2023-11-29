import router from "next/router";
import { useState } from "react";

import { supabase } from "../../utils/supabaseClient";

interface Props {
  onClose: () => void;
}

const LoginOrSignup: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/`,
      },
    });
    router.reload();
  };

  const handleSignIn = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.reload();
  };

  return (
    <div className="fixed left-5 top-10 z-50 flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-gray-800 p-6 text-white">
        <h2 className="mb-4 text-2xl font-bold">Login / Signup</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="mb-2 w-1/2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 focus:outline-none"
            >
              {loading ? "Loading..." : "Log In"}
            </button>
            <hr className="w-full border-t border-gray-300" />
            <button
              type="submit"
              disabled={loading}
              className="mb-2 w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <button
              onClick={onClose}
              className="w-1/2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginOrSignup;
