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
import type * as Quiz from "./api/quiz";

const notificationMethods = [
  { id: 'email', title: 'Email' },
  { id: 'sms', title: 'Phone (SMS)' },
  { id: 'push', title: 'Push notification' },
]

export default function Question({ question }) {
  return (
    <div>
      <label className="text-base font-semibold text-gray-900">{question.text}</label>
      {/* <p className="text-sm text-gray-500">How do you prefer to receive notifications?</p> */}
      <fieldset className="mt-4">
        <legend className="sr-only">Choices</legend>
        <div className="space-y-4">
          {question.options.map((option) => (
            <div key={option.text} className="flex items-center">
              <input
                id={option.text}
                name="notification-method"
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor={option.text} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                {option.text}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
