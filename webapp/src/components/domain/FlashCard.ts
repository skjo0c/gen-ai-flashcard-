export interface Flashcard {
  id: string;
  question: string;
  type: QuestionType;
  options?: Option[];
  answer: string | string[];
  explanation?: string;
}

export type QuestionType = 'SCQ' | 'MCQ' | 'QA';

export interface Option {
  id: string;
  text: string;
}
