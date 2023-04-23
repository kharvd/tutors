import { Quiz } from "@/types/quiz";
import { useState } from "react";
import { Button } from "./Button";
import Question from "./Question";

export function Quiz({ quiz, document }: { quiz: Quiz; document: string }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [graded, setGraded] = useState<boolean>(false);
  const [quizSummary, setQuizSummary] = useState<string | null>(null);

  function checkAnswers(): number {
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (quiz.questions[i].correct_answer == answers[i]) {
        score++;
      }
    }
    return score;
  }

  const generateSummaryResponse = async () => {
    setQuizSummary("");
    // setLoading(true);

    console.log("starting fetch");
    const response = await fetch("/api/summarizeQuiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document,
        quiz: quiz,
        answers: answers,
      }),
    });

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
      setQuizSummary((prev) => prev + chunkValue);
    }
    // setLoading(false);
  };

  function grade() {
    const score = checkAnswers();
    const percentage = (score / quiz.questions.length) * 100;

    setScore(percentage);
    setGraded(true);

    generateSummaryResponse();
  }

  return (
    <div>
      {quiz.questions.map((q, i) => (
        <Question
          key={`question-${i}`}
          index={i}
          question={q}
          graded={graded}
          userCorrect={graded && q.correct_answer == answers[i]}
          userSelected={answers[i]}
          onChoice={(index, choice) => {
            console.log(index, choice);
            const newAnswers = [...answers];
            newAnswers[index] = choice;
            setAnswers(newAnswers);
            setGraded(false);
            setScore(null);
          }}
        />
      ))}
      <div className="pt-4">
        <Button text="Check answers" onClick={grade} />
      </div>
      {score !== null && (
        <div className="pt-4">
          <div className="text-2xl font-semibold text-gray-900">
            Your score: {score.toFixed(0)}%
          </div>
          <p className="pt-4 mb-3 text-gray-500 dark:text-gray-400">
            {quizSummary}
          </p>
        </div>
      )}
    </div>
  );
}
