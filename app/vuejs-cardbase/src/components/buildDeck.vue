<template>
  <div>
    <nav>
      <ul>
        <li><router-link v-bind:to="'/library/' + id" exact>Library</router-link></li>
        <li><router-link v-bind:to="'/deck/' + id" exact>Deck</router-link></li>
        <li><router-link v-bind:to="'/packs/' + id" exact>Packs</router-link></li>
      </ul>
    </nav>
    <h1 class="score-text">{{"Deck Score: +" + deckScore}}</h1>
    <button v-on:click="saveDeck()" class='primary'>SAVE DECK</button>
    <div class="full-width">
      <div class="six columns first-column">
        <h3>Library</h3>
        <div v-for="card in cards" class="single-card" v-bind:key="card.name">
          <img :src="getImagePath(  card.imagePath )">
          <!--h2>{{ card.name }}</h2-->
          <p>{{ card.reservedQuantity + "/" + card.quantity }}</p>
          <div class="button-container">
            <button class="add" v-on:click="subtractFromDeck(card)" v-if="card.reservedQuantity > 0">Subtract</button>
            <button class="subtract" v-on:click="addToDeck(card)" v-if="card.reservedQuantity < card.quantity">Add</button>
          </div>
        </div>
      </div>
      <div class="six columns second-column">
        <h3>Deck</h3>
        <div v-for="card in reservedCards" class="single-card" v-bind:key="card.name">
          <img v-if="card.reservedQuantity > 0" :src="getImagePath(  card.imagePath )">
          <p v-if="card.reservedQuantity > 0">{{ card.reservedQuantity }}</p>
        </div>
      </div>
    <div>
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
      },
      addToDeck: function(in_card){
          if (in_card.reservedQuantity < in_card.quantity){
              in_card.reservedQuantity += 1;
          } 
      },
      subtractFromDeck: function(in_card){
          if (in_card.reservedQuantity > 0){
              in_card.reservedQuantity -= 1;
          } 
      },
      saveDeck: function(){
        for (let card of this.cards){
            if (card.initialReservedQuantity !== card.reservedQuantity && card.reservedQuantity <= card.quantity){
                console.log(card.initialReservedQuantity)
                this.$http.post('http://104.162.128.255:5000/saveDeck', {params: {id: this.id, name: card.name, reserved: card.reservedQuantity}}).then(function(data){});
            }
        }
      }
  },
  computed: {
      reservedCards: function(){
          return this.cards.filter(i => i.reservedQuantity > 0);
      },
      deckScore: function(){
        let out_deckScore = 0
        let deckScoreNoCost = 0;
        let deckScoreUncommon = 0;
        let deckScoreRare = 0;
        let deckCards = this.cards.filter(i => i.reservedQuantity > 0);
        for (let card of this.cards){
            if (card.rarity === 'UNCOMN') deckScoreUncommon += (1 * card.reservedQuantity);
            else if (card.rarity === 'RARE') deckScoreRare += (1 * card.reservedQuantity);
            if (card.cost === 'NO') deckScoreNoCost += (1 * card.reservedQuantity);
        }

        out_deckScore = Math.min(Math.floor(deckScoreUncommon / 5), 2) + Math.min(Math.floor(deckScoreRare / 3), 2) + Math.min(Math.floor(deckScoreNoCost/5), 1);

        return out_deckScore;
      }
  },
  created(){
      this.$http.get('http://104.162.128.255:5000/deck', {params: {id: this.id}}).then(function(data){
          this.cards = data.body;
          //keep track of initial reserved quantity
          for (let i = 0; i < this.cards.length; i++){
            this.cards[i].initialReservedQuantity = this.cards[i].reservedQuantity;
          }
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

.full-width {
    /*width:96vw;*/
    /*margin-left: calc(-1 * ((100vw - 100%) / 2));*/
    box-sizing:border-box;
    clear:both;
}

.first-column {
    border-right: #BBBBBB 2px solid;
}

.first-column, .second-column{
    overflow-y:auto;
    height:75vh;
}

h1.score-text{
    float:left;
}

button.primary {
    background-color: #1EAEDB;
    color: #fff;
    max-width: 160px;
    float:right;
    border-color:white;
    height:60px;
}

.add {
    background-color: #F14668;
    color: #fff;
    border-color:white;
}

.subtract {
    background-color: #48C774;
    color: #fff;
    border-color:white;
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

.button-container {
    display:flex;
    margin-top: 10px;
}

button, .button {
    display: inline-block;
    width: 50%;
    flex-grow: 1;
    font-size:13px;
    margin-left:4px;
    margin-right:4px;
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