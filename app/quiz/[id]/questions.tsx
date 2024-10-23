'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Question } from '../../api/quiz/route';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from '@nextui-org/react';
import { CheckCheckIcon, CheckIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import ReactConfetti from 'react-confetti';

import useWindowSize from 'react-use/lib/useWindowSize';

type Props = {
  id: string;
  questions: Question[];
};
function Questions({ id, questions }: Props) {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);

  const [viewAnswers, setViewAnswers] = useState(false);

  const question = useMemo(() => questions[index], [questions, index]);

  function validateAnswer(choice: string) {
    setChoices([...choices, choice]);
    setSelected(question.choices.indexOf(choice));

    if (choice === question.answer) {
      setScore(score + question.point);
    }

    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        setCompleted(true);
      }
    }, 100);
  }
  const { width, height } = useWindowSize();

  if (completed) {
    return (
      <motion.div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          initialVelocityY={10}
          initialVelocityX={10}
          gravity={0.1}
        />
        <Card className="xl:w-[30rem] max-h-[40rem] overflow-auto p-4">
          <CardHeader>
            <h1 className="text-xl font-semibold flex items-center">
              <CheckCheckIcon className="mr-2" />
              Quiz Completed
            </h1>
          </CardHeader>
          <CardBody>
            <p className="text-lg">
              Your score is <strong>{score}</strong> out of{' '}
              <strong>{questions.reduce((acc, q) => acc + q.point, 0)}</strong>.
            </p>

            <ul
              className={`mt-4 flex flex-col ${
                viewAnswers ? 'gap-6' : 'gap-2'
              }`}
            >
              {questions.map((q, i) => {
                const originalSelected = choices[i];
                const isCorrect = choices[i] === q.answer;

                return (
                  <li
                    key={i}
                    className={`${
                      isCorrect ? 'text-primary-500' : 'text-danger-500'
                    }`}
                  >
                    <div className="flex items-start gap-2 ">
                      {isCorrect ? (
                        <CheckIcon className="min-w-4 w-4 h-4" />
                      ) : (
                        <XIcon className="min-w-4 w-4 h-4" />
                      )}
                      <p className="text-sm text-neutral-500">{q.question}</p>
                    </div>

                    {viewAnswers && (
                      <div className="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                        <div className="flex flex-wrap gap-2">
                          {q.choices.map((choice, i) => {
                            const correct = q.answer === choice;

                            return (
                              <Chip
                                key={i}
                                variant="light"
                                size="sm"
                                className={`${
                                  correct
                                    ? 'bg-primary-500 text-white'
                                    : originalSelected === choice
                                    ? 'text-danger-500'
                                    : ''
                                }`}
                              >
                                {choice}
                              </Chip>
                            );
                          })}
                        </div>

                        <p className="mt-2 text-neutral-500 text-xs">
                          {q.reason}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardBody>
          <CardFooter className="gap-2 pb-6">
            <Button
              variant="shadow"
              size="sm"
              color="primary"
              onClick={() => setViewAnswers(!viewAnswers)}
            >
              {viewAnswers ? 'Hide Answers' : 'View Answers'}
            </Button>

            <div className="flex-1" />

            <Button
              size="sm"
              variant="flat"
              onClick={() => {
                window.location.reload();
              }}
            >
              Try Again
            </Button>

            <Link href="/">
              <Button variant="flat" size="sm">
                New Quiz
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Card className="xl:w-[30rem] p-4">
        <CardHeader>
          <motion.h1
            className="text-2xl font-semibold"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 4 * 0.07 }}
          >
            {question ? question.question : 'No questions found'}
          </motion.h1>
        </CardHeader>

        <CardBody>
          <AnimatePresence>
            <div className="grid grid-cols-2 gap-4">
              {question?.choices.map((choice, i) => (
                <motion.div
                  key={i}
                  className={`p-4 border dark:border-neutral-800 rounded-lg cursor-pointer ${
                    selected === i ? 'bg-primary-500 text-white' : ''
                  } select-none`}
                  onClick={() => {
                    validateAnswer(choice);
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                >
                  {choice}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </CardBody>
        <CardFooter>
          <p className="text-default-500 text-xs">
            Select answer carefully, you can&apos;t undo it.
          </p>
        </CardFooter>
      </Card>

      <p className="text-center mt-4 text-xs text-neutral-500">#{id}</p>
    </div>
  );
}

export default Questions;
