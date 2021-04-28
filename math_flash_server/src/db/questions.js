const path = require('path');
const fs = require('fs');
const logger = require('../logger').createNamedLogger('/db/questions');

function createUserDataFile(dataFilePath) {
  const initialData = {
    "multiplication" : {
      "timesTables" : {
        "questions" : [
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
  if(!fs.existsSync(dataFilePath)) {
    return createUserDataFile(dataFilePath);
  } else {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  }
}

function getAllQuestionsForUser(username) {
  return getUserData(username);
}

module.exports = {
  getAllQuestionsForUser: getAllQuestionsForUser
};
