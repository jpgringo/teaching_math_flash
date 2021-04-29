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

function getUserData(username) {
  const dataFilePath = path.join(__dirname, `data/${username}.json`);
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

module.exports = {
  getAllQuestionsForUser: getAllQuestionsForUser,
  getQuestionsForUser: getQuestionsForUser
};
