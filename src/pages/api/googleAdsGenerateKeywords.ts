import { getAuthHeader } from "@/utils/dataForSeoAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const post_array = [];
  post_array.push({
    location_name: "United States",
    keywords: ["phone", "cellphone"],
  });

  //todo: get data from the gpt response table in supabase

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
      throw new Error(`HTTP error! status: ${postResponse.status}`);
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
  await new Promise(resolve => setTimeout(resolve, 7000)); // Wait for 5 seconds

  try {
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
    const getResult = await getResponse.json();
    console.log(getResult);
    res.status(200).json({ getResult });
    //todo: sift through the data, convert to a CSV, and store in supabase
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}
