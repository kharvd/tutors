// pages/api/openai.ts
import { NextApiRequest, NextApiResponse } from "next";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { messages } = req.body;

    // Re-format messages to have "role" instead of "sender"
    const formattedMessages = messages.map((message: any) => ({
        ...message,
        role: message.sender,
        sender: undefined,
    }));

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: formattedMessages,
          });

        res.status(200).json(completion.data.choices[0].message);
    } catch (error) {
      console.error("OpenAI API Error:", error);
      res.status(500).json({ error: "OpenAI API error" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
