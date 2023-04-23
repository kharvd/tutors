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
  onChoice,
}: {
  index: number;
  question: Question;
  onChoice: (index: number, choice: number) => void;
}) {
  const handleChange = (e: any) => {
    onChoice(index, e.target.value);
  };

  return (
    <div className="pt-4">
      <label className="text-base font-semibold text-gray-900">
        {question.text}
      </label>
      {/* <p className="text-sm text-gray-500">How do you prefer to receive notifications?</p> */}
      <fieldset className="mt-4">
        <legend className="sr-only">Choices</legend>
        <div className="space-y-4">
          {question.options.map((option, i) => (
            <div key={option.text} className="flex items-center">
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
                {option.text}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
