import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { HashLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";

import { ProfileInfoContext } from "@/contexts/ProfileInfoContext";
import { UserContext } from "@/contexts/UserContext";
import { supabase } from "@/utils/supabaseClient";

import { keyWordQuestionSteps } from "./data/KeywordQuestions";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
  contentType: string;
  contentFocus: string;
  audienceFAQs: string;
};

export const KeyWordGenerator = () => {
  const profileInfo = useContext(ProfileInfoContext);
  const user = useContext(UserContext);
  const { register, handleSubmit } = useForm<FormValues>();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  //TODO: come back and refactor this monstrosity

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setIsLoading(true);
    if (step < keyWordQuestionSteps.length) {
      setStep(prevStep => prevStep + 1);
    } else {
      const mappedData = {
        project_type: data.contentType,
        project_focus: data.contentFocus,
        audience_faqs: data.audienceFAQs,
        user_id: user?.user?.id,
      };

      const { data: keywordGenPrompt, error } = await supabase
        .from("keyword_gen_prompt")
        .insert([mappedData])
        .select();

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        // Implementing the open ai prompt module getGptResponse here

        const keywordGenPromptId = keywordGenPrompt[0].id;

        const promptData = {
          project_type: mappedData.project_type,
          project_focus: mappedData.project_focus,
          audience_faqs: mappedData.audience_faqs,
        };

        const prompt = `The provided data for this task is ${JSON.stringify(
          promptData,
        )}.`;

        const gptResponse = await fetch("/api/gptResponse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await gptResponse.json();

        const gptResponseWords =
          data?.data?.[0].content?.[0].text.value.split(", ");
        if (gptResponseWords.length > 10) {
          data.data[0].content[0].text.value = gptResponseWords
            .slice(0, 50)
            .join(", ");
        }

        const { data: gptResponseData, error: gptError } = await supabase
          .from("gpt_keyword_results")
          .insert([
            {
              keyword_generator_id: keywordGenPromptId,
              gpt_response: data?.data?.[0].content?.[0].text.value,
              user_id: user?.user?.id,
            },
          ])
          .select();

        if (gptError) {
          console.error("Error inserting GPT response: ", gptError);
        }

        // Fetch the GPT keywords from Supabase
        const { data: gptKeywords, error } = await supabase
          .from("gpt_keyword_results")
          .select(
            "gpt_response, id, keyword_generator_id, has_been_posted_to_api",
          )
          .eq("user_id", user?.user?.id)
          .eq(
            "keyword_generator_id",
            gptResponseData?.[0].keyword_generator_id,
          );

        if (error) {
          console.error("Error fetching GPT keywords: ", error);
        } else {
          // Check if the request has already been sent
          if (gptKeywords?.[0].has_been_posted_to_api) {
            console.log("The request has already been sent. Skipping...");
          } else {
            // Send the keywords to the googleAdsGenerateKeywords API route

            await fetch("/api/googleAdsGenerateKeywords", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ keywords: gptKeywords }),
            })
              .then(response => response.json())
              .then(async data => {
                const csvData = data.csvResultArray;
                const resultID = data.resultID;
                const resultAmount = data.resultAmount;

                console.log("CSV DATA CLIENT:", csvData);

                console.log("DATA FOR SERO TRANSACTION RESULT ID:", resultID);

                // Convert promptData.project_type to lower case and replace spaces with underscores
                const formattedPageType = promptData.project_type
                  .toLowerCase()
                  .replace(/ /g, "_");

                const { data: uploadData, error: uploadError } =
                  await supabase.storage
                    .from("google-keywords-csv")
                    .upload(
                      `${user?.user?.id}/${formattedPageType}/${resultID}_${gptKeywords?.[0].keyword_generator_id}.csv`,
                      csvData,
                      { contentType: "text/csv" },
                    );

                //todo: add in secure policy to supabase before going live.

                if (uploadError) {
                  console.error(
                    "Error uploading CSV to Supabase: ",
                    uploadError,
                  );
                } else {
                  console.log("CSV uploaded to Supabase: ", uploadData);
                }

                const { data: projectData, error: projectError } =
                  await supabase.from("projects").insert([
                    {
                      user_id: user?.user?.id,
                      csv_file_path: `${user?.user?.id}/${formattedPageType}/${resultID}_${gptKeywords?.[0].keyword_generator_id}.csv`,
                      project_type: formattedPageType,
                      keyword_generator_prompt_id:
                        gptKeywords?.[0].keyword_generator_id,
                      gpt_keywords_id: gptKeywords?.[0].id,
                      amount_of_keywords: resultAmount,
                      gpt_keyword_sample: gptKeywords?.[0].gpt_response,
                    },
                  ]);

                if (projectError) {
                  console.error(
                    "Error logging project data to Supabase: ",
                    projectError,
                  );
                  console.log("projectData passed to supabase:", projectData);
                }

                // After sending the request, update the has_been_posted_to_api field to true
                const { error: updateError } = await supabase
                  .from("gpt_keyword_results")
                  .update({ has_been_posted_to_api: true })
                  .eq("id", gptKeywords?.[0].id);

                if (updateError) {
                  console.error(
                    "Error updating has_been_posted_to_api: ",
                    updateError,
                  );
                } else {
                  toast.success(
                    `${promptData.project_type} project was created!`,
                  );
                }
              })
              .catch(error => {
                console.error("Error:", error);
                toast.error("Error:", error);
              });

            restartProcess();
          }
        }
      }
    }
    setIsLoading(false);
  };

  const restartProcess = () => {
    setStep(1);
  };

  return (
    <div className=" relative rounded-3xl bg-gray-800 px-6 pt-6">
      <ToastContainer className="z-10" />
      {isLoading && (
        <div className="absolute ml-7 flex h-full w-3/4 items-center justify-center rounded-3xl ">
          <HashLoader color={"#6B46C1"} loading={isLoading} size={50} />
        </div>
      )}

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
                <div key={stepItem.id} className="flex flex-col">
                  <label
                    htmlFor={stepItem.name}
                    className="mb-2 mt-4 text-white"
                  >
                    {stepItem.question}
                  </label>
                  {stepItem.type === "dropdown" ? (
                    <select
                      className="mt-6 w-full rounded border p-2"
                      id={stepItem.name}
                      required={stepItem.validation.required}
                      {...register(stepItem.name as keyof FormValues)}
                    >
                      {stepItem.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : stepItem.name !== "finalStep" ? (
                    <textarea
                      className="mt-6 h-24 w-full rounded border p-2"
                      id={stepItem.name}
                      placeholder={stepItem.placeholder}
                      required={stepItem.validation.required}
                      {...register(stepItem.name as keyof FormValues)}
                    />
                  ) : null}
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
