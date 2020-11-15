<template>
  <div>
      <h1>It's Time to Duel!</h1>
      <form>
        <label>Username:</label>
        <input type="text" v-model="username" placeholder="Username" required>
        <button v-on:click.prevent="auth">Sign In</button>
      </form>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      username: ''
    }
  },
  methods: {
    auth: function (){
      console.log('posting!');
      this.$http.post('http://127.0.0.1:5000/login', { username: this.username }).then(function(data){
          console.log(data.body);
      });
    }
  }
}
</script>

<style scoped>

</style>

