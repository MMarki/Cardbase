<template>
  <div id="blogo">
    <h1>Add a new card to your library</h1>
    <div v-for="card in cards" class="single-card">
        <h2>{{ card.name }}</h2>
        <article>{{ card.quantity }}</article>
    </div>
    <button v-on:click="addCards">Open Pack</button>
    <div v-if="submitted">
      <h3>Cards have been saved to your library!</h3>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      cards: [
        {}
      ],
      submitted: false
    }
  },
  methods: {
    addCards: function (){
      this.$http.get('http://127.0.0.1:5000/packs', 
        {params: {id: 1}}).then(function(data){
          this.cards = data.body
          console.log(data);
      })
      this.submitted = true;
    }
  }
}
</script>

<style>
body{
  font-family: sans-serif;
}
#blogo{
  margin:20px auto;
  max-width: 600px;
}

label{
  display:block;
  margin: 20px 0 10px;
}

input[type="text"], textarea{
  display:block;
  width: 100%;
  padding: 8px;
}

#preview{
  padding: 10px 20px;
  border: 1px dotted #ccc;
  margin: 30px 0;
}

h3{
  margin-top: 10px;
}

#checkboxes input{
  display: inline-block;
  margin-right: 10px;
}

#checkboxes label{
  display: inline-block;
}
</style>