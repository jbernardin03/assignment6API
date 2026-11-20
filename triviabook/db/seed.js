const pool = require('./pool');

const topics = ['science', 'geography'];

const scienceQuestions = [
  { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
  { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
  { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' },
];

const geographyQuestions = [
  { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
  { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' },
];

const questionsByTopic = {
  science: scienceQuestions,
  geography: geographyQuestions,
};

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE questions, topics RESTART IDENTITY CASCADE');

    for (const topic of topics) {
      const { rows } = await client.query(
        'INSERT INTO topics (name) VALUES ($1) RETURNING id',
        [topic]
      );
      const topicId = rows[0].id;

      for (const q of questionsByTopic[topic]) {
        await client.query(
          `INSERT INTO questions (topic_id, question, answer, difficulty)
           VALUES ($1, $2, $3, $4)`,
          [topicId, q.question, q.answer, q.difficulty]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();