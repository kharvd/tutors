export type Question = {
  question_text: string;
  correct_answer: string;
  choices: Record<string, string>;
};

export type Quiz = {
  questions: Question[];
};
