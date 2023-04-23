import { Quiz } from "@/types/quiz";
import { useState } from "react";
import { Button } from "./Button";
import Question from "./Question";

export function Quiz({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [graded, setGraded] = useState<boolean>(false);

  function checkAnswers(): number {
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (quiz.questions[i].options[answers[i]].is_correct) {
        score++;
      }
    }
    return score;
  }

  function grade() {
    const score = checkAnswers();
    const percentage = (score / quiz.questions.length) * 100;

    setScore(percentage);
    setGraded(true);
  }

  return (
    <div>
      {quiz.questions.map((q, i) => (
        <Question
          key={`question-${i}`}
          index={i}
          question={q}
          graded={graded}
          userSelected={answers[i]}
          onChoice={(index, choice) => {
            const newAnswers = [...answers];
            newAnswers[index] = choice;
            setAnswers(newAnswers);
            setGraded(false);
          }}
        />
      ))}
      <div className="pt-4">
        <Button text="Check answers" onClick={grade} />
      </div>
      {score !== null && (
        <div className="pt-4">
          <div className="text-2xl font-semibold text-gray-900">
            Your score: {score}%
          </div>
        </div>
      )}
    </div>
  );
}
