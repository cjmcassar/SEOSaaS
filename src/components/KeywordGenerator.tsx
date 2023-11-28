import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { keyWordQuestionSteps } from "./data/KeywordQuestions";
import { supabase } from "@/utils/supabaseClient";

import { ProfileInfoContext } from "@/contexts/ProfileInfoContext";
import { UserContext } from "@/contexts/UserContext";

type FormValues = {
  // Define your form fields here. For example:

  contentType: string;
  contentFocus: string;
  audienceFAQs: string;
  // Add more fields as needed
};

//TODO: add in a wait wheel until the data is finished procuessing

export const KeyWordGenerator = () => {
  const profileInfo = useContext(ProfileInfoContext);
  const user = useContext(UserContext);
  const { register, handleSubmit } = useForm<FormValues>();
  const [step, setStep] = useState(1);

  //TODO: come back and refactor this monstrosity

  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (step < keyWordQuestionSteps.length) {
      setStep(prevStep => prevStep + 1);
    } else {
      const mappedData = {
        page_type: data.contentType,
        page_focus: data.contentFocus,
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
          page_type: mappedData.page_type,
          page_focus: mappedData.page_focus,
          audience_faqs: mappedData.audience_faqs,
        };

        const prompt = `SEO marketer with profile ${JSON.stringify(
          profileInfo,
        )} is seeking to generate exactly 10 keywords for their company. The provided data for this task is ${JSON.stringify(
          promptData,
        )}. Please provide the SEO keyword suggestions as a continuous text, separated by commas, and not as a list or numbered items. Only return the keywords, no other descriptions or assistant text is necessary.`;

        const gptResponse = await fetch("/api/gptResponse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await gptResponse.json();

        const gptResponseWords = data.choices?.[0].message.content.split(", ");
        if (gptResponseWords.length > 10) {
          data.choices[0].message.content = gptResponseWords
            .slice(0, 10)
            .join(", ");
        }

        const { data: gptResponseData, error: gptError } = await supabase
          .from("gpt_keyword_results")
          .insert([
            {
              keyword_generator_id: keywordGenPromptId,
              gpt_response: data.choices?.[0].message.content,
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

                console.log("CSV DATA CLIENT:", csvData);
                console.log("DATA FOR SERO TRANSACTION RESULT ID:", resultID);

                // Convert promptData.page_type to lower case and replace spaces with underscores
                const formattedPageType = promptData.page_type
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
                }
              })
              .catch(error => {
                console.error("Error:", error);
              });

            restartProcess();
          }
        }
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
