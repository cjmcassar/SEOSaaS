import { parse } from "json2csv";
import { NextApiRequest, NextApiResponse } from "next";

import { getAuthHeader } from "@/utils/dataForSeoAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { keywords } = req.body;

  const post_array = keywords.map((keyword: { gpt_response: string }) => ({
    location_name: "United States",
    keywords: keyword.gpt_response.split(", "), // assuming keywords are comma-separated
  }));

  let taskId;

  try {
    const postResponse = await fetch(
      "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/task_post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(post_array),
      },
    );
    if (!postResponse.ok) {
      res
        .status(400)
        .json({ error: `HTTP error! status: ${postResponse.status}` });
      return;
    }
    const postResult = await postResponse.json();

    if (postResult.status_code === 20000) {
      taskId = postResult.tasks[0].id;
    } else {
      throw new Error(
        `Task creation failed with status: ${postResult.status_code}`,
      );
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
    return;
  }

  // Wait for a certain amount of time before retrieving the postResults
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

  async function fetchTask(taskId: string, attempt: number = 1): Promise<any> {
    if (attempt > 10) {
      throw new Error("Maximum number of attempts reached");
    }

    const getResponse = await fetch(
      "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/task_get/" +
        taskId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
      },
    );

    if (!getResponse.ok) {
      throw new Error(`HTTP error! status: ${getResponse.status}`);
    }

    const getFetchResults = await getResponse.json();

    console.log("results response:", getFetchResults);

    if (getFetchResults.tasks?.[0].status_code !== 20000) {
      // Wait for 2 seconds before trying again
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchTask(taskId, attempt + 1);
    } else {
      return getFetchResults;
    }
  }

  // Use the function
  try {
    const getFetchResults = await fetchTask(taskId);

    // Convert JSON to CSV

    const resultAmount = getFetchResults.tasks[0].result_count;

    const resultArray = getFetchResults.tasks[0].result;

    const resultID = getFetchResults.tasks[0].id;

    const csvResultArray = parse(resultArray);

    res.setHeader("Content-Type", "text/csv");
    res.status(200).json({ csvResultArray, resultID, resultAmount });
    //todo: sift through the data, convert to a CSV, and store in supabase
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}
