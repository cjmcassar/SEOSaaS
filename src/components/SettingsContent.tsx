import React from "react";
import { profileSetupQuestions } from "./data/ProfileSetupQuestions";

export const SettingsContent: React.FC = () => {
  return (
    <div className="flex h-screen flex-wrap rounded-3xl bg-gray-800 p-5">
      <div className="h-max w-full rounded-3xl bg-white p-5 shadow-md">
        <h2 className="text-center text-2xl font-bold">Profile Settings</h2>
        <form className="grid grid-cols-2 gap-4">
          {profileSetupQuestions.map((question, index) => (
            <div key={question.id}>
              <div className="mt-5">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  {question.question}
                </label>
                <textarea
                  name={question.name}
                  className="h-20 w-full overflow-auto rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))}
        </form>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-5 w-max rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
