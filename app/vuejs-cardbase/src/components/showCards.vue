<template>
  <div>
      <nav>
        <ul>
          <li><router-link v-bind:to="'/library/' + id" exact>Library</router-link></li>
          <li><router-link v-bind:to="'/deck/' + id" exact>Deck</router-link></li>
          <li><router-link v-bind:to="'/packs/' + id" exact>Packs</router-link></li>
        </ul>
      </nav>
      <h1>Your Card Library:</h1>
      <p v-if="!Array.isArray(cards)">Open packs to build your library.</p>
      <div v-for="card in cards" class="single-card" v-bind:key="card.name">
        <img v-if="Array.isArray(cards)" :src="getImagePath(  card.imagePath )">
        <p v-if="Array.isArray(cards)">{{ card.quantity }}</p>
      </div>
  </div>
</template>

<script>

export default {

  data: function () {
    return {
        cards: [],
        id: this.$route.params.id
    }
  },
  methods: {
      getImagePath: function(in_imgPathFromDB){
          console.log(in_imgPathFromDB)
          let imagePath = '../public/' + 'assets/cards/twitcher.png';
          if (in_imgPathFromDB != undefined){
              imagePath = '../public/' + in_imgPathFromDB;
          }
          return imagePath;
      }
  },
  created(){
      this.$http.get('http://104.162.128.255:5000/library', {params: {id: this.id}}).then(function(data){
          this.cards = data.body
      })
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
    width: 30px;
    padding:  5px 10px;
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid #BBB;
    text-align: center; 
    z-index: 10;
    position: relative;
    font-weight: bold;
}

button, .button {
    display: block;
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