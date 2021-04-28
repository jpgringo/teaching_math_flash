import axios from "axios";
function getNextQuestion() {
  return axios.get('http://localhost:3333/api/multiplication/question');
}

export default {
  getNextQuestion: getNextQuestion
}
