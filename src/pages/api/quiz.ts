// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { load } from "js-yaml";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;

    if ("document" in data) {
      const text = data.document;
      const useGPT4 = data.useGPT4;
      const response = await generateQuestionsAndAnswers(text, useGPT4);
      res.status(200).json(response);
    } else {
      res
        .status(400)
        .json({ error: 'The "text" field is missing from the JSON data.' });
    }
  } else {
    res.status(400).json({ error: "No JSON data provided." });
  }
}

async function generateQuestionsAndAnswers(docText: string, useGPT4 = false) {
  const systemPrompt = `You are an AI tutor that tries to assess gaps in understanding. An ideal quiz captures understanding of concepts, asks students to translate their understanding to unknown settings/contexts,
and pushes students to move beyond mere definitions. Your goal is to create four quiz questions that test conceptual understanding and mastery. Multiple choice questions only.
Return in a YAML array with the following fields question text, choices, and correct answer. For the correct fields, return a-d, not the question text. Take it step by step.`;

  const questionPrompt = `
Document to quiz on:
${docText}

Example of one question:
- question_text: "Question"
  choices:
    a: "Choice 1"
    b: "Choice 2"
    c: "Choice 3"
    d: "Choice 4"
  correct_answer: c

YAML of questions:
`;

  const model = useGPT4 ? "gpt-4" : "gpt-3.5-turbo";

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const result = await openai.createChatCompletion({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: questionPrompt },
    ],
  });

  const questionYaml = result.data.choices[0].message?.content!;
  const dct = load(questionYaml);

  return {
    questions: dct,
  };
}
