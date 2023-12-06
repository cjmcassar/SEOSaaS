import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//TODO: revamp this to make it faster. This will fix the main issue. I believe things can be taken away instead of added

export async function getGptResponse(prompt: string) {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ASSISTANT_ID) {
    throw new Error("Missing OpenAI credentials");
  }

  try {
    const [keyFindGPTAssistant, thread] = await Promise.all([
      openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID),
      openai.beta.threads.create({
        messages: [{ role: "user", content: prompt }],
      }),
    ]);

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: keyFindGPTAssistant.id,
    });

    let checkStatusOfResponse;

    while (true) {
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
    }

    const gptAssistantResponse = await openai.beta.threads.messages.list(
      run.thread_id,
    );

    return gptAssistantResponse;
  } catch (error: any) {
    throw new Error(`Failed to retrieve OpenAI response: ${error.message}`);
  }
}
