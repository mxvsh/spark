import React from 'react';
import { redis } from '../../../lib/redis';
import { Question } from '../../api/quiz/route';
import Questions from './questions';
import { redirect } from 'next/navigation';

export default async function ({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const rawQuestions = (await redis.get(params.id)) ?? '[]';
  const questions = JSON.parse(rawQuestions) as Question[];

  if (questions.length === 0) {
    redirect('/');
  }

  return <Questions questions={questions} id={params.id} />;
}
