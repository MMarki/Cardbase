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
    <h5 class= "score-text">{{ "Deck Size: " + deckSize + "/30" }}</h5>
    <button v-on:click="saveDeck()" :class="isChanged ? 'primary' : 'inactive'">{{isChanged ? "SAVE DECK" : "SAVED" }}</button>
    <div v-if="Array.isArray(cards)" class="full-width">
      <div class="nine columns first-column">
        <h3>Library</h3>
        <div v-for="card in cards" class="single-card" v-bind:key="card.name">
          <img :src="getImagePath(  card.imagePath )">
          <p>{{ card.reservedQuantity + "/" + card.quantity }}</p>
          <div class="button-container">
            <button class="subtract" v-on:click="subtractFromDeck(card)" v-if="card.reservedQuantity > 0">Subtract</button>
            <button class="add" v-on:click="addToDeck(card)" v-if="card.reservedQuantity < card.quantity && deckSize < 30">Add</button>
          </div>
        </div>
      </div>
      <div class="three columns second-column">
        <h3>Deck</h3>
        <div v-for="card in reservedCards" class="single-chip" v-bind:key="card.name">
          <p v-if="card.reservedQuantity > 0">{{ card.reservedQuantity }}</p>
          <p v-if="card.reservedQuantity > 0">{{ card.name + " " }}</p>
          <img v-if="card.reservedQuantity > 0" :src="getRealRarity(card.rarity)">
          <p v-if="card.reservedQuantity > 0">{{card.cost }}</p>
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
        id: this.$route.params.id,
        deckSize: 0,
        isChanged: 0
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
              this.isChanged = 1;
          } 
      },
      subtractFromDeck: function(in_card){
          if (in_card.reservedQuantity > 0){
              in_card.reservedQuantity -= 1;
              this.isChanged = 1;
          } 
      },
      saveDeck: function(){
        let passedParams = {
            params: {
                id: this.id,
                cards: []
            }
        }
        for (let card of this.cards){
            if (card.initialReservedQuantity !== card.reservedQuantity && card.reservedQuantity <= card.quantity){
                passedParams.params.cards.push({name: card.name, reserved: card.reservedQuantity});
            }
        }
        this.$http.post('http://104.162.128.255:5000/saveDeck', passedParams).then(function(data){});
        this.isChanged = 0;
      },
      getRealRarity(in_string){
        let imagePath = '../public/' + 'assets/common.png';
        if (in_string === 'COMMON'){
            imagePath ='../public/' + 'assets/common.png';
        } else if (in_string === 'UNCOMN'){
            imagePath ='../public/' + 'assets/uncommon.png';
        } else if (in_string === 'RARE'){
            imagePath ='../public/' + 'assets/rare.png';
        } else {
            return 'ERROR';
        }
        return imagePath;
      }
  },
  computed: {
      reservedCards: function(){
        if(Array.isArray(this.cards)){
            return this.cards.filter(i => i.reservedQuantity > 0);
        }
      },
      deckScore: function(){
        let out_deckScore = 0
        let deckScoreNoCost = 0;
        let deckScoreUncommon = 0;
        let deckScoreRare = 0;
        this.deckSize = 0;
        if(Array.isArray(this.cards)){
            let deckCards = this.cards.filter(i => i.reservedQuantity > 0);
            for (let card of deckCards){
                this.deckSize += (1*card.reservedQuantity);
                if (card.rarity === 'UNCOMN') deckScoreUncommon += (1 * card.reservedQuantity);
                else if (card.rarity === 'RARE') deckScoreRare += (1 * card.reservedQuantity);
                if (card.cost === 'NO') deckScoreNoCost += (1 * card.reservedQuantity);
            }
        }
        out_deckScore = Math.min(Math.floor(deckScoreUncommon / 5), 2) + Math.min(Math.floor(deckScoreRare / 3), 2) + Math.min(Math.floor(deckScoreNoCost/5), 1);

        return out_deckScore;
      }
  },
  created(){
      this.$http.get('http://104.162.128.255:5000/deck', {params: {id: this.id}}).then(function(data){
          this.cards = data.body;
          //keep track of initial reserved quantity
          if(Array.isArray(this.cards)){
            for (let i = 0; i < this.cards.length; i++){
                this.cards[i].initialReservedQuantity = this.cards[i].reservedQuantity;
            }
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

.score-text{
    float:left;
}

.single-chip p{
    display: inline;
}

.single-chip img{
    width: 24px;
    vertical-align: middle;
}

.single-chip{
    margin: 4px;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid #BBB;
    height: 30px;
}

h5 {
    margin-left: 24px;
    margin-top: 13px;
}

button.primary {
    background-color: #1EAEDB;
    color: #fff;
    max-width: 160px;
    float:right;
    border-color:white;
    height:60px;
}

button.inactive {
    background-color: #fff;
    color: #222;
    max-width: 160px;
    float:right;
    border-color: #bbb;
    height:60px;
}

.subtract {
    background-color: #F14668;
    color: #fff;
    border-color:white;
}

.add {
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