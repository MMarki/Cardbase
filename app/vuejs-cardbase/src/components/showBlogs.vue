<template>
  <div id="show-blogs">
      <h1>Your Card Library:</h1>
      <div v-for="card in cards" class="single-card">
          <h2>{{ card.name }}</h2>
          <article>{{ card.quantity }}</article>
      </div>
  </div>
</template>

<script>

export default {

  data: function () {
    return {
        cards: []
    }
  },
  methods: {

  },
  created(){
      this.$http.get('http://127.0.0.1:5000/library', {params: {id: 1}}).then(function(data){
          this.cards = data.body
      })
  }
}
</script>

<style>
#show-blogs{
    max-width: 880px;
    margin: 0 auto;
}

.single-card{
    padding:20px;
    margin: 20px;
    box-sizing: border-box;
    background: #EEF;
}
</style>