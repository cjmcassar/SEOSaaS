import { useState } from "react";

import LoginOrSignup from "../components/modals/LoginOrSignup";

export default function NotLoggedIn() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="rounded-lg bg-gray-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold">
          You're not logged in to use KeyFind.
        </h1>
        <p className="mt-2 text-center">Please sign in here:</p>
        <a className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="mx-0 my-2 rounded bg-purple-700 px-4 py-2 text-white"
          >
            Login
          </button>
        </a>

        {showModal && <LoginOrSignup onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
}
