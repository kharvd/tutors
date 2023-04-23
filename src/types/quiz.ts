export type QuestionOption = {
  text: string;
  is_correct: boolean;
};

export type Question = {
  text: string;
  options: QuestionOption[];
};

export type Quiz = {
  questions: Question[];
};
