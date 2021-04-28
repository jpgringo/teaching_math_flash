<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Login></Login>
    <MultiplicationFlashCards></MultiplicationFlashCards>
  </div>
</template>

<script>
// @ is an alias to /src
import MultiplicationFlashCards from "@/components/MultiplicationFlashCards";
import Login from "@/components/Login";

export default {
  name: 'Home',
  components: {
    Login,
    MultiplicationFlashCards
  }
}
</script>
