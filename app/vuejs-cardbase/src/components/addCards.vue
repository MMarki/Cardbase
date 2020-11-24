<template>
  <div id="blogo">
    <nav>
      <ul>
          <li><router-link v-bind:to="'/library/' + id" exact>Library</router-link></li>
          <li><router-link v-bind:to="'/packs/' + id" exact>Pack</router-link></li>
      </ul>
    </nav>
    <h1>Open Your Card Packs:</h1>
    <div v-for="card in cards" v-if="submitted" class="single-card">
        <img :src="getImagePath(  card.imagePath )">
        <p>{{ card.rarity | unAbbreviate }}</p>
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
      packCount: 3,
      id: this.$route.params.id
    }
  },
  methods: {
    addCards: function (){
      this.$http.get('http://104.162.128.255:5000/packs', 
        {params: {id: this.id}}).then(function(data){
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
    getPackCount: function (){
      this.$http.get('http://104.162.128.255:5000/packCount', 
        {params: {id: this.id}}).then(function(data){
          this.packCount = data.body[0].packCount;
      })
    },
    getImagePath: function(in_imgPathFromDB){
      let imagePath = require('../' + in_imgPathFromDB);
      return imagePath;
    }
  },
  created(){
    this.getPackCount();
  }, 
  filters: {
    unAbbreviate: function (in_string) {
      let out_string = in_string;
      if (in_string === 'UNCOMN') out_string = 'UNCOMMON'
      return out_string;
      value = value.toString()
    }
  }
}
</script>

<style scoped>
.single-card{
    padding-bottom: 0px;
    margin: 20px;
    box-sizing: border-box;
    display: inline-block;
    border-radius: 20px;
    height: 440px;
}

.single-card img{
    max-width: 280px;
}
.single-card p{
    margin: -24px auto 0px auto;
    width: 95px;
    padding:  5px 10px;
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid #BBB;
    text-align: center; 
    z-index: 10;
    position: relative;
}

button, .button {
    display: block;
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

ul{
    list-style-type: none;
    margin: 0;
}

li{
    display: inline-block;
    margin: 0 16px;
}

a{
    color: #333;
    text-decoration: none;
    font-weight: bold;
    padding: 8px 8px;
}

nav{
    padding: 16px 0;
    margin-bottom: 20px;
}

.router-link-active{
    border-bottom: 2px solid #1EAEDB;
}
</style>