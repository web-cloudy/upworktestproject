import React, { useState, useEffect } from "react";
import questionsData from "./data/questions.json";
import scoringData from "./data/scoring.json";
import { Question } from "./types";
import ReactGA from "react-ga4"; // Importing Google Analytics library

const App: React.FC = () => {
  // Initialize Google Analytics
  useEffect(() => {
    ReactGA.initialize("G-Z1T1S6ERBE"); // Replace with your Measurement ID
    ReactGA.send("pageview"); // Track a pageview
  }, []);

  const questions: Question[] = questionsData.questions.map(q => ({
    ...q,
    type: q.type === 'single-choice' || q.type === 'comparison' ? q.type : 'single-choice'
  }));
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ [key: string]: number }>({});

  // Handle question answer selection
  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  // Calculate scores based on answers
  const calculateScores = () => {
    const scores: { [key: string]: number } = {};

    for (const questionId in answers) {
      const answer = answers[questionId];
      const scoringRule = (scoringData.scoring as Record<string, any>)[questionId]?.[answer];

      if (scoringRule) {
        for (const career in scoringRule) {
          scores[career] = (scores[career] || 0) + scoringRule[career];
        }
      }
    }

    setResult(scores);

    // Track questionnaire completion event
    ReactGA.event({
      category: "Questionnaire",
      action: "Completed",
      label: "Career Questionnaire",
    });
  };

  return (
    <div>
      <h1>Career Questionnaire</h1>
      {questions.map((question) => (
        <div key={question.id}>
          <h2>{question.en.question}</h2>
          {question.en.options?.map((option: string, idx: number) => (
            <div key={idx}>
              <input
                type="radio"
                name={question.id}
                value={option}
                onChange={() => handleAnswerChange(question.id, option)}
              />
              {option}
            </div>
          ))}
        </div>
      ))}
      <button onClick={calculateScores}>Submit</button>

      {Object.keys(result).length > 0 && (
        <div>
          <h2>Your Scores:</h2>
          {Object.entries(result).map(([career, score]) => (
            <div key={career}>
              <strong>{career}:</strong> {score}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;