const path = require('path');
const fs = require('fs');
const logger = require('../logger').createNamedLogger('/db/questions');

function createUserDataFile(dataFilePath) {
  const initialData = {
    "multiplication": {
      "timesTables": {
        "questions": [
          {
            "operands": [0, 0],
            "operation": "*",
            "correctAnswer": 0,
            "correct": 0,
            "incorrect": 0,
            "lastCorrect": null,
            "lastIncorrect": null
          }
        ]
      }
    }
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
  return initialData;
}

function getDataFilePath(username) {
  return path.join(__dirname, `data/${username}.json`);
}

function getUserData(username) {
  const dataFilePath = getDataFilePath(username);
  logger.info(`dataFilePath: ${dataFilePath}`);
  if (!fs.existsSync(dataFilePath)) {
    return createUserDataFile(dataFilePath);
  } else {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  }
}

function getAllQuestionsForUser(username) {
  return getUserData(username);
}

function getQuestionsForUser(username, section, type, includeCalculatedFields) {
  const userData = getUserData(username);
  if (userData[section] !== undefined && userData[section][type] !== undefined) {
    const questions = userData[section][type].questions;
    if (includeCalculatedFields) {

      return questions.map(q => {
        const totalResponses = q.correct + q.incorrect;
        return Object.assign({}, q, {
          lastResponse: Math.max(q.lastCorrect, q.lastIncorrect),
          percentCorrect: totalResponses > 0 ? q.correct / totalResponses : NaN
        })
      });
    } else {
      return questions;
    }
  }
}

function checkArrayEquality(a, b) {
  let areEqual = false;
  if (a.length === b.length) {
    areEqual = a.every((v, i) => v === b[i]);
  }
  return areEqual;
}

function findQuestionForUser(username, question) {
  const allQuestions = getQuestionsForUser(username, 'multiplication', 'timesTables');
  const matchingQuestions = allQuestions.filter(q =>
    checkArrayEquality(q.operands, question.operands)
    && q.operation === question.operation);
  logger.info(`matchingQuestions: %o`, matchingQuestions);
  return matchingQuestions.length > 0 ? matchingQuestions[0] : null;
}

function incrementQuestionRecord(questionRecord, isAnswerCorrect) {
  return Object.assign({},
    questionRecord,
    {
      correct: isAnswerCorrect ? questionRecord.correct + 1 : questionRecord.correct,
      incorrect: !isAnswerCorrect ? questionRecord.incorrect + 1 : questionRecord.incorrect,
      lastCorrect: isAnswerCorrect ? new Date() : questionRecord.lastCorrect,
      lastIncorrect: !isAnswerCorrect ? new Date() : questionRecord.lastIncorrect
    });
}

function incrementResponseForUser(username, path, question, isAnswerCorrect) {
  const allQuestions = getUserData(username);
  const [section, questionType] = path.split('/');
  const questionSubset = allQuestions[section][questionType].questions;
  logger.info(`questionSubset: %o`, questionSubset);
  const qIndex = questionSubset.findIndex(q =>
    checkArrayEquality(q.operands, question.operands)
    && q.operation === question.operation);
  logger.info(`qIndex=${qIndex}`);
  let updatedQuestion;
  if(qIndex !== -1) {
    const existingRecord = questionSubset[qIndex];
    updatedQuestion = incrementQuestionRecord(existingRecord, isAnswerCorrect);
    questionSubset.splice(qIndex, 1, updatedQuestion);
  } else {
    updatedQuestion = incrementQuestionRecord(question, isAnswerCorrect);
    questionSubset.push(updatedQuestion);
  }
  logger.info(`updated question subset: %o`, questionSubset);
  logger.info(`all questions, updated? %o`, allQuestions);
  updateDataFile(username, allQuestions);
  return updatedQuestion;
}

function updateDataFile(username, newData) {
  const dataFilePath = getDataFilePath(username);
  fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), (err) => {
    if (err) throw err;
    logger.info(`Saved data to '${dataFilePath}'`);
  });
}

module.exports = {
  getAllQuestionsForUser: getAllQuestionsForUser,
  getQuestionsForUser: getQuestionsForUser,
  findQuestionForUser: findQuestionForUser,
  incrementResponseForUser: incrementResponseForUser
};
