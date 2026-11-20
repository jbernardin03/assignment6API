const model = require('../models/triviaModel');

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

// GET /triviabook/topics
async function getTopics(req, res) {
  try {
    const topics = await model.getTopics();
    res.status(200).json({ topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /triviabook/topic/:topic?limit=2&difficulty=easy
async function getQuestionsByTopic(req, res) {
  try {
    const topic = req.params.topic.trim().toLowerCase();
    const { limit, difficulty } = req.query;

    let parsedLimit;
    if (limit !== undefined) {
      parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
        return res
          .status(400)
          .json({ error: 'limit must be a positive integer' });
      }
    }

    let parsedDifficulty;
    if (difficulty !== undefined) {
      parsedDifficulty = String(difficulty).trim().toLowerCase();
      if (!DIFFICULTIES.includes(parsedDifficulty)) {
        return res.status(400).json({
          error: `difficulty must be one of: ${DIFFICULTIES.join(', ')}`,
        });
      }
    }

    if (!(await model.topicExists(topic))) {
      return res.status(404).json({ error: `Topic '${topic}' not found` });
    }

    const questions = await model.getQuestionsByTopic(topic, {
      limit: parsedLimit,
      difficulty: parsedDifficulty,
    });
    res.status(200).json({ topic, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /triviabook/random  (answer is NOT included)
async function getRandomQuestion(req, res) {
  try {
    const question = await model.getRandomQuestion();
    if (!question) {
      return res.status(404).json({ error: 'No questions available' });
    }
    res.status(200).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /triviabook/answer   body: { id, guess }
async function checkAnswer(req, res) {
  try {
    const { id, guess } = req.body || {};

    if (id === undefined || id === null || guess === undefined || guess === null) {
      return res
        .status(400)
        .json({ error: 'Both id and guess are required in the request body' });
    }

    const questionId = Number(id);
    if (!Number.isInteger(questionId) || questionId < 1) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const question = await model.getQuestionById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ error: `Question with id ${questionId} not found` });
    }

    const correct =
      String(guess).trim().toLowerCase() ===
      question.answer.trim().toLowerCase();

    res.status(200).json({ correct, answer: question.answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /triviabook/question/add   body: { topic, question, answer, difficulty }
async function addQuestion(req, res) {
  try {
    const { topic, question, answer, difficulty } = req.body || {};

    const missing = ['topic', 'question', 'answer', 'difficulty'].filter(
      (field) => !isNonEmptyString((req.body || {})[field])
    );
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ error: `Missing required parameter(s): ${missing.join(', ')}` });
    }

    const cleanDifficulty = difficulty.trim().toLowerCase();
    if (!DIFFICULTIES.includes(cleanDifficulty)) {
      return res.status(400).json({
        error: `difficulty must be one of: ${DIFFICULTIES.join(', ')}`,
      });
    }

    const cleanTopic = topic.trim().toLowerCase();

    await model.addQuestion({
      topic: cleanTopic,
      question: question.trim(),
      answer: answer.trim(),
      difficulty: cleanDifficulty,
    });

    const questions = await model.getQuestionsByTopic(cleanTopic);
    res.status(201).json({ topic: cleanTopic, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getTopics,
  getQuestionsByTopic,
  getRandomQuestion,
  checkAnswer,
  addQuestion,
};