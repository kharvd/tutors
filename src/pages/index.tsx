import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import Question from "../components/Question";
import type * as Quiz from "./api/quiz";

const inter = Inter({ subsets: ["latin"] });

async function summarize(text: string): Promise<string> {
  console.log("summarizing text", text);
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  const { summary } = await response.json();
  return summary;
}

async function getQuiz(text: string): Promise<Quiz.Data> {
  console.log("getting quiz", text);
  const response = await fetch("/api/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  return response.json();
}

export default function Home() {
  const [document, setDocument] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [quiz, setQuiz] = useState<Quiz.Data | null>(null);

  return (
    <main className="p-4">
      <h2 className="text-4xl font-extrabold dark:text-white">Tutorly</h2>
      <p className="my-4 text-lg text-gray-500">
        A tool to help you learn better
      </p>
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Class materials
      </label>

      <textarea
        id="message"
        rows={10}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Paste your document here"
        onChange={(e) => setDocument(e.target.value)}
      >
        {document}
      </textarea>
      <div className="mt-4">
        <input
          type="button"
          value="Summarize"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={async (e) => {
            const summary = await summarize(document);
            setSummary(summary);
          }}
        />
        <input
          type="button"
          value="Start Quiz"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={async (e) => {
            const quiz = await getQuiz(document);
            console.log(quiz);
            setQuiz(quiz);
          }}
        />
      </div>
      {summary && (
        <div>
          Summary:
          <div>{summary}</div>
        </div>
      )}
      <Question />
      {quiz && (
        <div>
          Quiz:
          <div>{JSON.stringify(quiz)}</div>
        </div>
      )}
    </main>
  );
}
