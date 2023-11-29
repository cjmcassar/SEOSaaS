import router from "next/router";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { supabase } from "@/utils/supabaseClient";

import { profileSetupQuestions } from "./data/ProfileSetupQuestions";

type FormValues = {
  industry_served: string;
  business_model: string;
  profitable_products_services: string;
  target_audience_ideal_customer: string;
  competitors_relevant_content: string;
  unique_value_proposition: string;
  primary_business_objectives: string;
  key_features_benefits: string;
  created_profile: boolean;
};

export const ProfileSetup = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const [step, setStep] = useState(1);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    console.log("form data:", data);
    if (step < profileSetupQuestions.length) {
      setStep(prevStep => prevStep + 1);
    } else {
      const mappedData = {
        industry_served: data.industry_served,
        business_model: data.business_model,
        profitable_products_services: data.profitable_products_services,
        target_audience_ideal_customer: data.target_audience_ideal_customer,
        competitors_relevant_content: data.competitors_relevant_content,
        unique_value_proposition: data.unique_value_proposition,
        primary_business_objectives: data.primary_business_objectives,
        key_features_benefits: data.key_features_benefits,
        created_profile: true,
      };
      console.log("mapped data:", mappedData);
      const { data: uploadedData, error } = await supabase
        .from("profiles")
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            ...mappedData,
          },
        ]);

      if (error) {
        console.error("Error inserting data: ", error);
        console.log("uploadedData being sent to sb:", uploadedData);
      } else {
        restartProcess();
        router.reload();
      }
    }
  };

  const restartProcess = () => {
    setStep(1);
  };

  return (
    <div className="z-50 w-1/2 rounded-3xl bg-gray-800 px-6 pt-6">
      <div className="flex pb-6 text-2xl font-bold text-white">
        <p>Profile Setup</p>
      </div>
      <div>
        <div className="mb-3 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-500 text-center text-xs text-white transition-all duration-300"
            style={{
              width: `${Math.min(
                (step / profileSetupQuestions.length) * 100,
                100,
              )}%`,
            }}
          ></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {profileSetupQuestions.map(
            (stepItem, index) =>
              index + 1 === step && (
                <div key={stepItem.id} className="flex flex-col ">
                  <label
                    htmlFor={stepItem.name}
                    className="mb-2 mt-4 text-white"
                  >
                    {stepItem.question}
                  </label>
                  {stepItem.name !== "created_profile" && (
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
              {step < profileSetupQuestions.length
                ? "Next"
                : "Create Your Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
