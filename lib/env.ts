import { cleanEnv, str } from 'envalid';

export const env = cleanEnv(process.env, {
  PROVIDER: str({
    default: 'openai',
    choices: ['openai', 'ollama'],
  }),
  MODEL: str({
    default: 'gpt-4o-mini',
  }),
  OPENAI_API_KEY: str({
    default: '',
  }),
});
