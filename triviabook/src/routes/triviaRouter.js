const express = require('express');
const controller = require('../controllers/triviaController');

const router = express.Router();

router.get('/topics', controller.getTopics);
router.get('/topic/:topic', controller.getQuestionsByTopic);
router.get('/random', controller.getRandomQuestion);
router.post('/answer', controller.checkAnswer);
router.post('/question/add', controller.addQuestion);

module.exports = router;