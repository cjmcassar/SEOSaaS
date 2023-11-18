import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { keyWordQuestionSteps } from "./data/KeywordQuestions";
import { supabase } from "@/utils/supabaseClient";

type FormValues = {
  // Define your form fields here. For example:

  contentType: string;
  contentFocus: string;
  audienceFAQs: string;
  // Add more fields as needed
};

export const KeyWordGenerator = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const [step, setStep] = useState(1);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    console.log(data);
    if (step < keyWordQuestionSteps.length) {
      setStep(prevStep => prevStep + 1);
    } else {
      const mappedData = {
        page_type: data.contentType,
        page_focus: data.contentFocus,
        audience_faqs: data.audienceFAQs,
      };

      const { error } = await supabase
        .from("keyword_gen_prompt")
        .insert([mappedData]);

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        restartProcess();
      }
    }
  };

  const restartProcess = () => {
    setStep(1);
  };

  return (
    <div className="rounded-3xl bg-gray-800 px-6 pt-6">
      <div className="flex pb-6 text-2xl font-bold text-white">
        <p>Generate Keywords</p>
      </div>
      <div>
        <div className="mb-3 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-500 text-center text-xs text-white transition-all duration-300"
            style={{
              width: `${Math.min(
                (step / keyWordQuestionSteps.length) * 100,
                100,
              )}%`,
            }}
          ></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {keyWordQuestionSteps.map(
            (stepItem, index) =>
              index + 1 === step && (
                <div key={stepItem.id} className="flex flex-col ">
                  <label
                    htmlFor={stepItem.name}
                    className="mb-2 mt-4 text-white"
                  >
                    {stepItem.question}
                  </label>
                  {stepItem.name !== "finalStep" && (
                    <textarea
                      className="mt-6 h-24 w-full rounded border p-2"
                      id={stepItem.name}
                      placeholder={stepItem.placeholder}
                      required={stepItem.validation.required}
                      {...register(stepItem.name as keyof FormValues)}
                    />
                  )}
                </div>
              ),
          )}

          <div className="mt-4 flex justify-center">
            <button
              className="mb-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              {step < keyWordQuestionSteps.length
                ? "Next"
                : "Create New Keyword List"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};