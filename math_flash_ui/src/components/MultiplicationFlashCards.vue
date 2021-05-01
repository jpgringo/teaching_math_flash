<template>
  <div class="component flash-cards multiplication">
    <form v-if="isLoggedIn" @submit.prevent="nextAction">
      <div class="card">
        <div id="card-front" class="front" :class="currentState">
          <span class="question">
              <span class="operand">{{ operand1 }}</span>
              <span class="operator">x</span>
              <span class="operand">{{ operand2 }}</span>
          </span>
          <span class="answer"><input type="text" v-model="userAnswer"></span>
        </div>
        <div id="card-back" class="back" :class="currentState">
          <span class="question">
              <span class="operand">{{ latestResponse.question.operands[0] }}</span>
              <span class="operator">x</span>
              <span class="operand">{{ latestResponse.question.operands[0] }}</span>
          </span>
          <span class="answer">{{ latestResponse.question.correctAnswer }}</span>
          <span class="user-answer"
                :class="{correct: latestResponse.isCorrect, incorrect: !latestResponse.isCorrect }">
            {{ latestResponse.userAnswer }}
          </span>
          <!--          <span class="next" @click="getNextQuestion">next</span>-->
          <button type="submit" class="next">Next</button>
        </div>
      </div>
    </form>
    {{ currentState }}
    <select name="" id="" v-model="currentState">
      <option value="asked">asked</option>
      <option value="submitted">submitted</option>
      <option value="response-received">response-received</option>
      <option value="cross-fade">cross-fade</option>
      <option value="evaluated">evaluated</option>
      <option value="completed">completed</option>
    </select>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
  name: "MultiplicationFlashCards",
  data: function () {
    return {
      currentState: 'asked',
      userAnswer: undefined
    }
  },
  computed: {
    ...mapGetters('auth', ["isLoggedIn"]),
    ...mapState('multiplication', ['currentQuestion', 'latestResponse']),
    operand1() {
      return this.currentQuestion !== undefined ?
          this.currentQuestion.operands[0] :
          undefined;
    },
    operand2() {
      return this.currentQuestion !== undefined ?
          this.currentQuestion.operands[1] :
          undefined;
    },
    cardFrontClass() {
      let className = '';
      switch (this.currentState) {
        case 'asked':
          className = 'active';
          break;
        case 'submitted':
          className = 'front-transitional';
          break;
        case 'evaluated':
          className = 'inactive';
          break;
      }
      return className;
      //   active: currentState === 'asked',
      //       transitional
      // :
      //   currentState === 'submitted',
      //       inactive
      // :
      //   currentState === 'evaluated'
      // }
    }
  },
  watch: {
    latestResponse(newVal) {
      // console.log(`latest response changed:`, newVal);
      if (this.currentQuestion && newVal && newVal.question
          && newVal.question.operation === this.currentQuestion.operation
          && this.compareOperandLists(newVal.question.operands, this.currentQuestion.operands)) {
        this.currentState = 'response-received';
      }
    },
    currentState(newVal, oldVal) {
      // console.log(`state has transitioned from '${oldVal}' to '${newVal}'`);
    }
  },
  mounted() {
    // console.log(`mounted`);
    const cardFront = document.getElementById('card-front'),
        cardBack = document.getElementById('card-back');
    cardFront.addEventListener('transitionend', this.cardFrontTransitionComplete, true);
    cardBack.addEventListener('transitionend', this.cardBackTransitionComplete, true);
    this.getNextQuestion();
  },
  methods: {
    getNextQuestion() {
      // console.log(`will get next question...`);
      this.userAnswer = undefined;
      this.$store.dispatch('multiplication/requestNextQuestion');
      this.currentState = 'asked';
    },
    evaluateAnswer() {
      // console.log(`will evaluate answer...`);
      this.$store.dispatch('multiplication/submitAnswer', this.userAnswer);
      this.currentState = 'submitted';
    },
    nextAction() {
      switch (this.currentState) {
        case 'asked':
          this.evaluateAnswer();
          break;
        case 'evaluated':
          this.getNextQuestion()
          this.currentState = 'completed';
          break;
        default:
          // do nothing
          break;
      }

    },
    compareOperandLists(a, b) {
      let areEqual = false;
      if (a.length === b.length) {
        areEqual = a.every((v, i) => parseInt(v) === parseInt(b[i]));
      }
      return areEqual;
    },
    cardFrontTransitionComplete(e) {
      // console.log(`card front transition has completed '${e.target.className}'`);
      if (e.target.className.split(' ').includes('response-received')) {
        this.currentState = 'cross-fade';
        setTimeout(() => {
          this.currentState = 'evaluated';
        }, 50);
      }
    },
    cardBackTransitionComplete(e) {
      // console.log(`card front transition has completed '${e.target.className}'`);
      if (e.target.className.split(' ').includes('completed')) {
        this.currentState = 'cross-fade-reverse';
        setTimeout(() => {
          this.currentState = 'asked';
        }, 50);
      }
    }

  }
}
</script>

<style scoped>

</style>
