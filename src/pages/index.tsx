import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { Quiz } from "@/types/quiz";
import { Quiz as QuizComponent } from "@/components/Quiz";
import { Button } from "@/components/Button";

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

async function getQuiz(text: string): Promise<Quiz> {
  console.log("getting quiz", text);
  const response = await fetch("https://tutors-backend-production.up.railway.app/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ document: text, "useGPT4": false }),
  });
  return response.json();
}

export default function Home() {
  const [document, setDocument] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);

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
        <Button
          text="Summarize"
          onClick={async () => {
            const summary = await summarize(document);
            setSummary(summary);
          }}
        />
        <Button
          text="Start Quiz"
          onClick={async () => {
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

      {/* <Question /> */}
      {quiz && <QuizComponent quiz={quiz} />}
    </main>
  );
}
