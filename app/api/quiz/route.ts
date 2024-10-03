import { generateText, LanguageModelV1, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ollama } from 'ollama-ai-provider';
import uniqid from 'uniqid';
import { redis } from '../../../lib/redis';
import { env } from '../../../lib/env';

export const maxDuration = 60;

let model: LanguageModelV1;

if (env.PROVIDER === 'openai') {
  model = openai(env.MODEL);
} else {
  model = ollama(env.MODEL);
}

const questionSchema = z.object({
  question: z.string(),
  choices: z.array(z.string()),
  answer: z.string(),
  point: z
    .number()
    .describe('The point value of the question, must be a positive integer'),
  reason: z.string().describe('The reason for the correct answer'),
});

export type Question = z.infer<typeof questionSchema>;

export async function POST(req: Request) {
  const { topic, difficulty = 'medium', numQuestions = 5 } = await req.json();

  const result = await generateText({
    model,
    tools: {
      generateQuiz: tool({
        description: 'A tool to generate multiple-choice questions',
        parameters: questionSchema,
      }),
    },
    toolChoice: 'required',
    maxSteps: 15,
    system:
      `You are an AI quiz generator. You have been given a topic and a number of questions to generate.\n` +
      `You have to generate multiple-choice questions on the given topic.\n` +
      `The questions should be of the given difficulty level.\n` +
      `You can generate up to the given number of questions.\n` +
      `Be creative and make the questions interesting.\n` +
      `Do not generate questions that are too easy or too difficult.`,

    prompt: `Topic: ${topic}\nDifficulty: ${difficulty}\nNumber of Questions: ${numQuestions}`,
  });

  const id = uniqid.time();

  const questions: Question[] = result.toolCalls.map(call => call.args);

  // expire in 2 hours
  const EX = 60 * 60 * 2;

  await redis.set(id, JSON.stringify(questions), 'EX', EX);

  return new Response(id, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
