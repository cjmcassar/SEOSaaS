import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

import { supabase } from "@/utils/supabaseClient";

import { profileSetupQuestions } from "./data/ProfileSetupQuestions";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
  industry_served: string;
  business_model: string;
  profitable_products_services: string;
  target_audience_ideal_customer: string;
  competitors_relevant_content: string;
  unique_value_proposition: string;
  primary_business_objectives: string;
  key_features_benefits: string;
};

type PlaceholderData = {
  industry_served: string;
  business_model: string;
  profitable_products_services: string;
  target_audience_ideal_customer: string;
  competitors_relevant_content: string;
  unique_value_proposition: string;
  primary_business_objectives: string;
  key_features_benefits: string;
};

export const SettingsContent: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const [placeholderData, setPlaceholderData] =
    useState<PlaceholderData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) {
        console.error("Error fetching data: ", error);
      } else {
        console.log("placehodler data:", data);
        setPlaceholderData(data);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    let changes: Partial<FormValues> = {};

    for (const key in data) {
      const typedKey = key as keyof FormValues;
      if (
        data[typedKey] !== "" &&
        !_.isEqual(
          data[typedKey],
          placeholderData?.[key as keyof PlaceholderData],
        )
      ) {
        changes[typedKey] = data[typedKey];
      }
    }

    // Send data to Supabase
    const { error } = await supabase
      .from("profiles")
      // Replace 'profiles' with your table name
      .update(changes)
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error("Error inserting data: ", error);
      toast.error("Error inserting data: " + error.message);
    } else {
      console.log("Data inserted successfully!");
      toast.success("Profile updated successfully!");
    }
  };

  return (
    <div className="flex h-screen flex-wrap rounded-3xl bg-gray-800 p-5">
      <ToastContainer className="z-10" />
      <div className="h-max w-full rounded-3xl bg-white p-5 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Profile Settings
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {profileSetupQuestions.slice(0, -1).map(question => (
            <div key={question.id}>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                {question.question}
              </label>
              <textarea
                {...register(question.name as keyof FormValues)}
                name={question.name}
                defaultValue={
                  placeholderData
                    ? String(
                        placeholderData[question.name as keyof PlaceholderData],
                      )
                    : ""
                }
                className="h-20 w-full overflow-auto rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
                style={{ width: "100%" }}
              />
            </div>
          ))}
          <button
            type="submit"
            className="col-span-1 mt-5 w-max rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700 md:col-span-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
