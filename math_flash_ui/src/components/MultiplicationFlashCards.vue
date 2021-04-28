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
import {/*mapState,*/ mapGetters} from 'vuex';

export default {
  name: "MultiplicationFlashCards",
  data: function () {
    return {
      currentState: 'question',
      operand1: 0,
      operand2: 0,
      userAnswer: undefined
    }
  },
  computed: {
    ...mapGetters('auth', ["isLoggedIn"])
  },
  mounted() {
    this.$store.dispatch('multiplication/requestNextQuestion');
  },
  methods: {
    evaluateAnswer() {
      console.log(`will evaluate answer`);
      if(this.userAnswer !== undefined) {
        const userAnswer = parseInt(this.userAnswer);
        const evaluatedAnswer = this.operand1 * this.operand2;
        const isCorrect = evaluatedAnswer === userAnswer;
        console.log(`${this.operand1} x ${this.operand2}:`
        + `${userAnswer} ${isCorrect ? '=' : '≠'} ${evaluatedAnswer}`
        + `… ${isCorrect ? 'correct!' : 'WRONG'}`);
      }
    }
  }
}
</script>

<style scoped>

</style>
