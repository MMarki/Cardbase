<template>
  <div>
      <h1>It's Time to Duel!</h1>
      <form>
        <label>Username:</label>
        <input type="text" v-model="username" placeholder="Username" required>
        <button v-on:click.prevent="auth">Sign In</button>
      </form>
      <div v-if="error">
        <p class="alert">This is not a real username - please try again!</p>
      </div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      username: '',
      error: 0
    }
  },
  methods: {
    auth: function (){
      console.log('posting!');
      this.$http.post('http://104.162.128.255/login', { username: this.username }).then(function(data){
          console.log(data.body);
          if (data.body.id !== undefined){
            this.error = 0;
            this.$router.push({ name: 'library', params: { id: data.body.id } });
          } else {
            this.error = 1
          }
      });
    }
  }
}
</script>

<style scoped>
.alert{
  background-color:#EDD4D4;
  color: #561515;
  border-radius: .25rem;
  border: 1px solid #E5C2C2;
  padding: 1rem 1.5rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
}
</style>

