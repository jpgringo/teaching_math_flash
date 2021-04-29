<template>
  <div class="component flash-cards multiplication">
    <form v-if="isLoggedIn" @submit.prevent="evaluateAnswer">
      <div class="card front">
      <span class="question">
        <span class="operand">{{ operand1 }}</span>
        <span class="operator">x</span>
        <span class="operand">{{ operand2 }}</span></span>
        <span class="answer"><input type="text" v-model="userAnswer"></span>
      </div>
    </form>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
  name: "MultiplicationFlashCards",
  data: function () {
    return {
      currentState: 'question',
      userAnswer: undefined
    }
  },
  computed: {
    ...mapGetters('auth', ["isLoggedIn"]),
    ...mapState('multiplication', ['currentQuestion']),
    operand1() {
      return this.currentQuestion !== undefined ?
        this.currentQuestion.operands[0] :
          undefined;
    },
    operand2() {
      return this.currentQuestion !== undefined ?
        this.currentQuestion.operands[1] :
          undefined;
    }
  },
  mounted() {
    this.$store.dispatch('multiplication/requestNextQuestion');
  },
  methods: {
    evaluateAnswer() {
      console.log(`will evaluate answer`);
      this.$store.dispatch('multiplication/submitAnswer', this.userAnswer);
      if(this.userAnswer !== undefined) {
        const userAnswer = parseInt(this.userAnswer);
        const correctAnswer = this.currentQuestion ? this.currentQuestion.correctAnswer : undefined;
        const isCorrect = correctAnswer === userAnswer;
        console.log(`${this.operand1} x ${this.operand2} = `
        + `${correctAnswer} ${isCorrect ? '=' : '≠'} ${userAnswer}`
        + `… ${isCorrect ? 'correct!' : 'WRONG'}`);
      }
    }
  }
}
</script>

<style scoped>

</style>
