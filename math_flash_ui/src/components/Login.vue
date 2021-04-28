<template>
  <div class="component login" :class="{authenticated: isLoggedIn}">
    <div class="login-status" v-if="isLoggedIn">
      <label>logged in as</label> <span class="full-name">{{ displayName }}</span>
      <button class="log-out" @click="logOut">Log Out</button>
    </div>
    <div class="login-form" v-else>
      <form @submit.prevent="authenticate">
        <fieldset>
        <span class="field"><label for="username">user name</label><input type="text" id="username"
                                                                          v-model="username"
                                                                          placeholder="user name"></span>
          <!--   TODO: change password field to password type (clear text is more convenient during dev  -->
          <span class="field"><label for="password">password</label><input type="text" id="password"
                                                                           v-model="password"
                                                                           placeholder="password"></span>
        </fieldset>
        <button @click="authenticate">Log In</button>
      </form>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex';

export default {
  name: 'Login',
  data: function () {
    return {
      username: undefined,
      password: undefined
    }
  },
  computed: {
    ...mapState('auth', ['displayName']),
    ...mapGetters('auth', ['isLoggedIn'])
  },
  watch: {
    isLoggedIn(newVal, _oldVal) {
      // only clear the username on successful logins
      if (newVal === true) this.username = undefined;
    }
  },
  methods: {
    authenticate() {
      console.log(`authenticating with un=${this.username}, pw=${this.password}`);
      const pw = this.password;
      this.$store.dispatch('auth/authenticate',
          {username: this.username, password: 'secret'});
      this.password = undefined; // clear the password on every attempt
    },
    logOut() {
      this.$store.dispatch('auth/logOut');
    }
  }
}
</script>
