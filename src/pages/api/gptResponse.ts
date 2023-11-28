// pages/api/gptResponse.js
import { getGptResponse } from "@/utils/openaAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const prompt = req.body.prompt;
    const gptResponse = await getGptResponse(prompt);
    res.status(200).json(gptResponse);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
