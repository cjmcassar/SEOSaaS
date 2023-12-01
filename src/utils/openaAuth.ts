import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getGptResponse(prompt: string) {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ASSISTANT_ID) {
    throw new Error("Missing OpenAI credentials");
  }

  let keyFindGPTAssistant;
  try {
    keyFindGPTAssistant = await openai.beta.assistants.retrieve(
      process.env.OPENAI_ASSISTANT_ID,
    );
  } catch (error: any) {
    throw new Error(`Failed to retrieve OpenAI Assistant: ${error.message}`);
  }

  let thread;
  try {
    thread = await openai.beta.threads.create({
      messages: [{ role: "user", content: prompt }],
    });
  } catch (error: any) {
    throw new Error(`Failed to create OpenAI thread: ${error.message}`);
  }

  let run;
  try {
    run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: keyFindGPTAssistant.id,
    });
  } catch (error: any) {
    throw new Error(`Failed to create OpenAI run: ${error.message}`);
  }

  const maxTimeout = 4000; // e.g., 10 seconds
  const startTime = Date.now();
  let checkStatusOfResponse;
  try {
    while (true) {
      if (Date.now() - startTime > maxTimeout) {
        throw new Error("Response timed out");
      }

      checkStatusOfResponse = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );

      if (checkStatusOfResponse.status === "completed") {
        break;
      }

      if (
        checkStatusOfResponse.status === "failed" ||
        checkStatusOfResponse.status === "cancelled"
      ) {
        throw new Error(`Response ${checkStatusOfResponse.last_error}`);
      }

      await delay(500);
    }
  } catch (error: any) {
    throw new Error(`Error during run status check: ${error.message}`);
  }

  let gptAssistantResponse;
  try {
    gptAssistantResponse = await openai.beta.threads.messages.list(
      run.thread_id,
    );
  } catch (error: any) {
    throw new Error(`Failed to retrieve OpenAI response: ${error.message}`);
  }

  return gptAssistantResponse;
}
