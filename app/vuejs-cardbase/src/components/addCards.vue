<template>
  <div id="blogo">
    <h1>Add new cards to your library</h1>
    <div v-for="card in cards" v-if="submitted" class="single-card">
        <h3>{{ card.name }}</h3>
        <p>{{ card.rarity }}</p>
    </div>
    <div v-if="submitted">
      <p class="alert">These cards have been saved to your library :)</p>
    </div>
    <button v-on:click="addCards" v-if="!submitted && packCount>0">Open Pack ({{ packCount }})</button>
    <button v-on:click="showPack" v-if="submitted">Next Pack</button>
    <p v-if="!submitted && packCount===0">No More Card Packs, Gamers</p>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      cards: [
        {}
      ],
      submitted: false,
      packCount: 3
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
      this.packCount--;
    },
    showPack: function (){
      this.cards = [];
      this.submitted = false;
    },

  }
}
</script>

<style>
.single-card{
    padding:20px;
    margin: 20px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #BBB;
    display: inline-block;
    width: 250px;
    height: 176px;
    border-radius: 20px;
}

button, .button {
    display: block;
}

.single-card h2{
    height: 120px;
}
.alert{
  background-color:#d4edda;
  color: #155724;
  border-radius: .25rem;
  border: 1px solid #c3e6cb;
  padding: 1rem 1.5rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
}
</style>