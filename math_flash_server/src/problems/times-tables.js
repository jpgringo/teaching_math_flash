const logger = require('../logger').createNamedLogger('/problems/times-tables');
const questionDb = require('../db').questions;

const RANGE_LIMITS = {
  failure: 0.3,
  poor: 0.5,
  moderate: 0.8,
  good: 0.95,
  epsilon: 0.0001
}

function getAllProblemsForUser(username) {
  return questionDb.getAllQuestionsForUser(username);
}

function addToRangeMap(rangeMap, rangeName, question) {
  const range = rangeMap.get(rangeName) || rangeMap.set(rangeName, {
    stats: {totalResponses: 0, correct:0, incorrect:0},
    questions: []
  }).get(rangeName);
  range.stats.totalResponses += question.correct + question.incorrect;
  range.stats.correct += question.correct;
  range.stats.incorrect += question.incorrect;
  range.questions.push(question);
  rangeMap.set('total', range.questions.length);
  const questionMaxOperand = Math.max(...question.operands);
  range.stats.maxOperand =
    range.stats.maxOperand !== undefined ?
      Math.max(range.stats.maxOperand, questionMaxOperand) : questionMaxOperand;
  rangeMap.set('maxOperand',
    rangeMap.get('maxOperand') !== undefined ?
      Math.max(rangeMap.get('maxOperand'), questionMaxOperand) : questionMaxOperand);
  const questionProduct = question.operands.reduce((acc, operand) => acc * operand, 1);
  range.stats.maxResult =
    range.stats.maxResult !== undefined ?
      Math.max(range.stats.maxResult, questionProduct) : questionProduct;
  rangeMap.set('maxResult',
    rangeMap.get('maxResult') !== undefined ?
      Math.max(rangeMap.get('maxResult'), questionProduct) : questionProduct);
}

function questionsByRange(username) {
  const questions = questionDb.getQuestionsForUser(username, 'multiplication', 'timesTables', true);
  logger.info(`questions: %o`, questions);
  const rangeMap = questions.reduce((acc, q) => {
    if (isNaN(q.percentCorrect)) {
      addToRangeMap(acc, 'new', q);
    } else if(Math.abs(1 - q.percentCorrect) < RANGE_LIMITS.epsilon) {
      addToRangeMap(acc, 'mastered', q);
    } else if(q.percentCorrect < RANGE_LIMITS.failure) {
      addToRangeMap(acc, 'failure', q);
    } else if(q.percentCorrect < RANGE_LIMITS.poor) {
      addToRangeMap(acc, 'poor', q);
    } else if(q.percentCorrect < RANGE_LIMITS.moderate) {
      addToRangeMap(acc, 'moderate', q);
    } else if(q.percentCorrect < RANGE_LIMITS.good) {
      addToRangeMap(acc, 'moderate', q);
    } else {
      addToRangeMap(acc, 'effectively mastered', q);
    }
    return acc;
  }, new Map());
  logger.info(`rangeMap: %o`, rangeMap);
  return rangeMap;
}

function getNextProblem(username) {
  // types of problems:
  // - completely new ones
  // - ones which have a low success rate
  // - those which have recently had a high success rate
  // - those which had a high success rate, but haven't been seen in some time

  // new problems should be introduced as frequently as possible, but only:
  // - when a threshold of 'stuck problems' has not been exceeded (i.e., those frequently answered incorrectly)
  // - not to the exclusion of 'stale' problems (assuming that those have an acceptable success rate

  // next problem order of preference
  // - stuck problems, preferring those with the poorest performance
  // - problems with moderate success rates
  // - new problems
  // - problems with high success rates, rated by necessity (success rate vs time last seen)

  // ranges:
  // - new: undefined success rate
  // - failure: 0-30% success
  // - poor: 30-50%
  // - moderate: 40-80%
  // - good: 80-95%
  // - effective mastery: 95-99%
  // - mastery: 100%

  // random threshold. The number of total questions below which the algorithm will not be applied = 30

  // complete mastery. If all questions have complete mastery, then new questions will temporarily take
  // precedence, with mastered questions being selected randomly and included at a rate of 20%

  let nextQuestion;
  const questionMap = questionsByRange(username);
  logger.info(`getting next problem for user '${username}': %o`, questionMap);
  logger.info(`question map as array: %o`, Array.from(questionMap));
  if (questionMap.get('total') <= 30) {
    const weightedProblems = Array.from(questionMap).reduce((acc, [key, val]) => {
      logger.info(`key=${key}: %o`, val);
      if (val.questions !== undefined) {
        acc = acc.concat(val.questions);
      }
      return acc;
    }, []);
    if (weightedProblems.length > 0) {
      nextQuestion = weightedProblems[Math.floor(Math.random() * weightedProblems.length)]
    }
  }
  return nextQuestion;
}

function checkAndRecordAnswerForUser(username, question, answer) {
  const matchingQuestion = questionDb.findQuestionForUser(username, question);
  if(matchingQuestion !== null) {
    questionDb.incrementResponseForUser(username, 'multiplication/timesTables',
      question, question.correctAnswer === answer);
  }
}

module.exports = {
  getAllProblemsForUser: getAllProblemsForUser,
  // findProblemForUser: findProblemForUser,
  getAllQuestionsByRange: questionsByRange,
  getNextProblem: getNextProblem,
  checkAndRecordAnswerForUser: checkAndRecordAnswerForUser
}
