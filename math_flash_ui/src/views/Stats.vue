<template>
  <div class="view stats">
    <p>latest stats:</p>
    <section class="section" v-for="(section, sectionName) of latestStats">
      <h2>{{ sectionName }}</h2>
      <section class="type" v-for="(questionData, questionType) in section">
        <h3>{{ questionType }}</h3>
        <p>Max Operand: {{ questionData.maxOperand }}</p>
        <table>
          <thead>
          <tr>
            <th rowspan="2">Operands</th>
            <th rowspan="2">Operation</th>
            <th colspan="2">Correct Responses</th>
            <th colspan="2">Incorrect Responses</th>
            <th colspan="3">All Responses</th>
          </tr>
          <tr>
            <td>Count</td>
            <td>Latest</td>
            <td>Count</td>
            <td>Latest</td>
            <td>Count</td>
            <td>Latest</td>
            <td>% Correct</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="question in questionData.questions">
            <td>{{ question.operands }}</td>
            <td>{{ question.operation }}</td>
            <td>{{ question.correct }}</td>
            <td>{{ formatDate(question.lastCorrect) }}</td>
            <td>{{ question.incorrect }}</td>
            <td>{{ formatDate(question.lastIncorrect) }}</td>
            <td>{{ totalResponses(question) }}</td>
            <td>{{ formatDate(latestResponse(question)) }}</td>
            <td>{{ percentCorrect(question) }}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </section>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "Stats",
  computed: {
    ...mapState('stats', ['latestStats'])
  },
  mounted() {
    this.$store.dispatch('stats/getLatestStats');
  },
  methods: {
    formatDate(date) {
      console.log(`date:`, date);
      if (date) {
        const dateObject = new Date(date);
        return `${dateObject.getDate()} ${this.threeLetterMonth(dateObject.getMonth())} `
            + `${dateObject.getFullYear().toString().substr(2,2)} `
            + `${dateObject.getHours()}:${dateObject.getMinutes().toString().padStart(2, '0')}`;
      } else {
        return '—';
      }
    },
    threeLetterMonth(monthIndex) {
      return ['Jan', 'Feb', 'Mar', 'Apr','May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
    },
    totalResponses(question) {
      return question.correct + question.incorrect;
    },
    latestResponse(question) {
      return Math.max(question.latestCorrect, question.latestIncorrect);
    },
    percentCorrect(question) {
      const total = this.totalResponses(question);
      return total > 0 ? question.correct / total * 100 : NaN;
    }
  }
}
</script>

<style scoped>

</style>
