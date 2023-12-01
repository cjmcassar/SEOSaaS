// pages/api/gptResponse.js
import { NextApiRequest, NextApiResponse } from "next";

import { getGptResponse } from "@/utils/openaAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      // const prompt = "give me some keywords for a e-commerce website";
      const prompt = req.body.prompt; // Uncomment this when you want to use request body
      const gptResponse = await getGptResponse(prompt);

      res.status(200).json(gptResponse);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error:", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
