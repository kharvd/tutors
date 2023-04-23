import { Quiz } from "@/types/quiz";
import { useState } from "react";
import Question from "./Question";

export function Quiz({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<number[]>([]);
  return (
    <div>
      {quiz.questions.map((q, i) => (
        <Question
          key={`question-${i}`}
          index={i}
          question={q}
          onChoice={(index, choice) => {
            const newAnswers = [...answers];
            newAnswers[index] = choice;
            setAnswers(newAnswers);
          }}
        />
      ))}
    </div>
  );
}
