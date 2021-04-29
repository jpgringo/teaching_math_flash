<template>
  <div class="component range-stats">
    <slot name="title"></slot>
    <table>
      <thead>
      <tr>
        <th>Range</th>
        <th>Total Questions</th>
        <th>% Correct</th>
        <th>Max Operand</th>
        <th>Max Result</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="[rangeName, range] of statRanges">
        <td class="data range">{{ rangeName }}</td>
        <td>{{range.stats.total}}</td>
        <td>{{formatPercent(range.stats.percentCorrect)}}</td>
        <td>{{range.stats.maxOperand}}</td>
        <td>{{range.stats.maxResult}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "RangeStats",
  computed: {
    statRanges() {
      return Object.entries(this.rangeStats)
          .filter(([key, val]) => {
            return val.stats !== undefined;
          }).map(range => {
            const stats = range[1].stats;
            console.log(`stats:`, stats);
            stats.percentCorrect = stats.totalResponses === 0 ? 'N/A' :
                stats.correct / stats.totalResponses;
            return range;
          });
    },
    ...mapState('stats', ['rangeStats'])
  },
  methods: {
    formatPercent(percent) {
      return `${Math.round(percent * 10000, 2)/100}%`;
    }
  }
}
</script>

<style scoped>

</style>
