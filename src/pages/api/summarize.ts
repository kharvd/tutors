// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import openai, { Configuration, OpenAIApi } from "openai";

type Data = {
  summary: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Summarize the following document: ${req.body.text}`,
  });

  console.log(completion.data.choices[0].text);
  res.status(200).json({ summary: completion.data.choices[0].text! });
}
