'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Input,
  Button,
  Select,
  SelectItem,
  Card,
  CardFooter,
  CardHeader,
  CardBody,
  Chip,
  Slider,
} from '@nextui-org/react';
import { quizTopics } from '../constants';

function getTopics(count: number) {
  const topics = new Set<string>();

  while (topics.size < count) {
    const index = Math.floor(Math.random() * quizTopics.length);
    topics.add(quizTopics[index]);
  }

  return Array.from(topics);
}

const Page = () => {
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSuggestedTopics(getTopics(4));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/quiz', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        difficulty,
        numQuestions,
      }),
    }).then(response => {
      setLoading(false);
      if (response.ok) {
        response.text().then(id => {
          window.location.href = `/quiz/${id}`;
        });
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.form onSubmit={handleSubmit}>
          <Card className="xl:w-[30rem] p-4">
            <CardHeader>
              <div className="flex flex-col">
                <p className="text-lg font-medium">Get started</p>
                <p className="text-small text-default-500">
                  Create a quiz to test your knowledge
                </p>
              </div>
            </CardHeader>

            <CardBody className="space-y-4">
              <div>
                <Input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Enter quiz topic"
                  required
                  label="Topic"
                />

                <div className="mt-2 flex gap-2 overflow-auto">
                  {suggestedTopics.map((suggestedTopic, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => {
                        setTopic(suggestedTopic);
                      }}
                    >
                      {suggestedTopic}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <Select
                  label="Select difficulty"
                  onChange={e => {
                    setDifficulty(e.target.value);
                  }}
                >
                  <SelectItem key={0} value="easy">
                    Easy
                  </SelectItem>
                  <SelectItem key={1} value="medium">
                    Medium
                  </SelectItem>
                  <SelectItem key={2} value="hard">
                    Hard
                  </SelectItem>
                </Select>
              </div>
              <div>
                <Slider
                  label="Number of questions"
                  step={1}
                  maxValue={15}
                  minValue={2}
                  value={numQuestions}
                  className="max-w-md"
                  onChange={value => {
                    setNumQuestions(value as number);
                  }}
                />
              </div>
            </CardBody>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                color="primary"
                isLoading={loading}
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </motion.form>
      </div>
    </AnimatePresence>
  );
};

export default Page;
