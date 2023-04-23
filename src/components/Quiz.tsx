import { Quiz } from "@/types/quiz";
import { useState } from "react";
import { Button } from "./Button";
import Question from "./Question";

export function Quiz({ quiz, onAnswersChange }: { quiz: Quiz; onAnswersChange: (answers: string[]) => void }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [graded, setGraded] = useState<boolean>(false);

  function checkAnswers(): number {
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (quiz.questions[i].correct_answer == answers[i]) {
        score++;
      }
    }
    return score;
  }

  function grade() {
    const score = checkAnswers();
    const percentage = (score / quiz.questions.length) * 100;

    console.log(quiz);

    setScore(percentage);
    setGraded(true);
  }

  function onChoice(index: number, choice: string) {
    console.log(index, choice);
    const newAnswers = [...answers];
    newAnswers[index] = choice;
    setAnswers(newAnswers);
    setGraded(false);
    setScore(null);

    // Notify the parent component about the change in answers
    onAnswersChange(newAnswers);
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
          onChoice={onChoice}
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
