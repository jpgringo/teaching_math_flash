const questionDb = require('../db').questions;

function getAllProblemsForUser(username) {
 return questionDb.getAllQuestionsForUser(username);
}

function getNextProblem(username) {
  return {
    operands: [2, 3],
    operation: '*',
    correctAnswer: 6,
    correct: 0,
    incorrect: 0,
    lastCorrect: undefined,
    lastIncorrect: undefined
  }
}

module.exports = {
  getAllProblemsForUser: getAllProblemsForUser,
  getNextProblem: getNextProblem
}
