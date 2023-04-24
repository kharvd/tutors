import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { Quiz } from "@/types/quiz";
import { Quiz as QuizComponent } from "@/components/Quiz";
import { Button } from "@/components/Button";

const inter = Inter({ subsets: ["latin"] });

// async function summarize(text: string): Promise<string> {
//   console.log("summarizing text", text);
//   const response = await fetch("/api/summarize", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ text }),
//   });
//   const { summary } = await response.json();
//   return summary;
// }

async function getQuiz(text: string): Promise<Quiz> {
  console.log("getting quiz", text);
  const response = await fetch("/api/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ document: text, useGPT4: false }),
  });
  return response.json();
}

function LoadingIndicator() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function Home() {
  const [document, setDocument] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const generateSummaryResponse = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setSummary("");
    setLoading(true);

    console.log("starting fetch");
    const response = await fetch(
      "https://tutors-backend-production.up.railway.app/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: document,
        }),
      }
    );

    console.log("response", response);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      console.log("no data");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      console.log("chunk", chunkValue);
      setSummary((prev) => prev + chunkValue);
    }
    setLoading(false);
  };

  return (
    <main className="p-4">
      {/* <h2 className="text-4xl font-extrabold dark:text-white">Tutorly</h2>
      <p className="my-4 text-lg text-gray-500">
        A tool to help you learn better
      </p> */}
      <h1 className="text-5xl font-extrabold dark:text-white">
        Tutorly
        <small className="ml-2 font-semibold text-gray-500 dark:text-gray-400">
          A tool to help you learn better
        </small>
      </h1>

      <div className="flex flex-row space-y-4 p-4">
        <div className="w-1/2 mx-auto h-screen">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Class materials
          </label>

          <textarea
            id="message"
            rows={10}
            className="h-4/6 block screen p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Paste your document here"
            onChange={(e) => setDocument(e.target.value)}
          >
            {document}
          </textarea>
          <div className="mt-4 flex space-x-2">
            <Button
              text="Summarize"
              onClick={async (e: any) => {
                await generateSummaryResponse(e);
              }}
            />
            <Button
              text="Start Quiz"
              onClick={async () => {
                setLoading(true);
                const quiz = await getQuiz(document);
                console.log(quiz);
                setQuiz(quiz);
                setLoading(false);
              }}
            />
            {loading && <LoadingIndicator />}
          </div>
        </div>
        <div className="w-1/2 mx-auto p-4">
          {summary && (
            <div>
              <h3 className="text-3xl font-bold dark:text-white">Summary</h3>
              <p className="pt-4 mb-3 text-gray-500 dark:text-gray-400">
                {summary}
              </p>
            </div>
          )}

          {/* <Question /> */}
          {quiz && <QuizComponent document={document} quiz={quiz} />}
        </div>
      </div>
    </main>
  );
}
