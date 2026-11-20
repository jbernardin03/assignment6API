DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS topics;

CREATE TABLE topics (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE questions (
  id         SERIAL PRIMARY KEY,
  topic_id   INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE INDEX idx_questions_topic_id ON questions(topic_id);