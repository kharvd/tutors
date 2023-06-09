/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Question } from "@/types/quiz";

export default function Question({
  index,
  question,
  graded,
  userSelected,
  userCorrect, // if user was correct
  onChoice,
}: {
  index: number;
  question: Question;
  graded: boolean;
  userSelected: string | null;
  userCorrect: boolean;
  onChoice: (index: number, choice: string) => void;
}) {
  const handleChange = (e: any) => {
    onChoice(index, e.target.value);
  };

  console.log(index, userSelected, userCorrect);

  return (
    <div className="pt-4">
      <label className="text-base font-semibold text-gray-900">
        {question.question_text}
      </label>
      {/* <p className="text-sm text-gray-500">How do you prefer to receive notifications?</p> */}
      <fieldset className="mt-4">
        <legend className="sr-only">Choices</legend>
        <div className="space-y-4">
          {Object.entries(question.choices).map(([i, option]) => {
            return (
              <div key={option} className="flex items-center">
                <input
                  id={`q-${index}-o-${i}`}
                  type="radio"
                  name={`question-${index}`}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  value={i}
                  onChange={handleChange}
                />
                <label
                  htmlFor={`q-${index}-o-${i}`}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {option}
                  {/* {`i: ${i}, userSelected: ${userSelected}, userCorrect: ${userCorrect}, graded: ${graded}`} */}{" "}
                  {graded && userCorrect && userSelected == i && (
                    <span>✅</span>
                  )}
                  {graded && !userCorrect && userSelected == i && (
                    <span>❌</span>
                  )}

                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
