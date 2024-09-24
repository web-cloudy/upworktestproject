export type Question = {
  id: string;
  type: "single-choice" | "comparison"; // Specific union type
  en: {
    question: string;
    options?: string[]; // Optional
    pairs?: any;        // Optional, depending on the question type
  };
  et: {
    question: string;
    options?: string[];
    pairs?: any;
  };
  ru: {
    question: string;
    options?: string[];
    pairs?: any;
  };
};

export interface ScoringRule {
  [key: string]: number;
}

export interface CareerPath {
  id: string;
  en: string;
  et: string;
  ru: string;
  fields: {
    en: string;
    et: string;
    ru: string;
  }[];
}