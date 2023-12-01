import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

// Helper function to delay for a given number of milliseconds
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getGptResponse(prompt: string) {
  // Retrieve GPT assistant
  const keyFindGPTAssistant = await openai.beta.assistants.retrieve(
    process.env.OPENAI_ASSISTANT_ID || "asst_WvMJRiMbJQTlgnJtQfXWgrZv",
  );

  console.log("gpt assistant:", keyFindGPTAssistant);

  // Create a thread
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Create a run
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: keyFindGPTAssistant.id,
  });

  // Check the status of the response
  let checkStatusOfResponse;
  while (true) {
    checkStatusOfResponse = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id,
    );

    // If the status is 'completed', break out of the loop
    if (checkStatusOfResponse.status === "completed") {
      break;
    }

    // If the status is 'failed' or 'cancelled', throw an error
    if (
      checkStatusOfResponse.status === "failed" ||
      checkStatusOfResponse.status === "cancelled"
    ) {
      throw new Error(`Response ${checkStatusOfResponse.last_error}`);
    }

    // If the status is 'queued', 'in_progress', or 'cancelling', wait for a bit before checking again
    await delay(2000); // wait for 5 seconds
  }

  // Retrieve the messages from the completed run
  const gptAssistantResponse = await openai.beta.threads.messages.list(
    run.thread_id,
  );

  return gptAssistantResponse;
}
