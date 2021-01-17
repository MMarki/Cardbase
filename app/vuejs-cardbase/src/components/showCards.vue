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
      <div class="chip-container">
            <button :class="filterConditions.common ? 'chip-active-common' : 'chip-inactive'" v-on:click="updateFilter('common')" v-if="Array.isArray(cards)">COMMON</button>
            <button :class="filterConditions.uncommon ? 'chip-active-uncommon' : 'chip-inactive'" v-on:click="updateFilter('uncommon')" v-if="Array.isArray(cards)">UNCOMMON</button>
            <button :class="filterConditions.rare ? 'chip-active-rare' : 'chip-inactive'" v-on:click="updateFilter('rare')" v-if="Array.isArray(cards)">RARE</button>
            <button :class="filterConditions.noCost ? 'chip-active' : 'chip-inactive'" v-on:click="updateFilter('noCost')" v-if="Array.isArray(cards)">NO COST</button>
            <button :class="filterConditions.oneCost ? 'chip-active' : 'chip-inactive'" v-on:click="updateFilter('oneCost')" v-if="Array.isArray(cards)">ONE COST</button>
            <button :class="filterConditions.twoCost ? 'chip-active' : 'chip-inactive'" v-on:click="updateFilter('twoCost')" v-if="Array.isArray(cards)">TWO COST</button>
            <button :class="filterConditions.threeCost ? 'chip-active' : 'chip-inactive'" v-on:click="updateFilter('threeCost')" v-if="Array.isArray(cards)">THREE COST</button>
            <button :class="filterConditions.sacrifice ? 'chip-active-sacrifice' : 'chip-inactive'" v-on:click="updateFilter('sacrifice')" v-if="Array.isArray(cards)">SACRIFICE</button>
      </div>
      <p v-if="!Array.isArray(cards)">Open packs to build your library.</p>
      <div v-for="card in filteredCards" class="single-card" v-bind:key="card.name">
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
        id: this.$route.params.id,
        filterConditions: {
            common: false,
            uncommon: false,
            rare: false,
            noCost: false,
            oneCost: false,
            twoCost: false,
            threeCost: false,
            sacrifice: false
        }
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
      updateFilter: function(in_filterCondition){
        var oldCondition = this.filterConditions[in_filterCondition];
        for (var filter in this.filterConditions){
            this.filterConditions[filter] = false;
        }
        this.filterConditions[in_filterCondition] = !oldCondition;
      }
  },
  created(){
      this.$http.get('http://104.162.128.255:5000/library', {params: {id: this.id}}).then(function(data){
          this.cards = data.body
      })
  },
  computed: {
      filteredCards: function(){
        var out_filteredCards;
        var filterIsActive = false;
        for (var filter in this.filterConditions){
            if (this.filterConditions[filter] === true) {
                filterIsActive = true;
            }
        }
        if (!filterIsActive){
            return this.cards;
        } else if(Array.isArray(this.cards)){
            if(this.filterConditions.common) {
                out_filteredCards = this.cards.filter(i => i.rarity === 'COMMON');
            } else if(this.filterConditions.uncommon) {
                out_filteredCards = this.cards.filter(i => i.rarity === 'UNCOMN');
            } else if(this.filterConditions.rare) {
                out_filteredCards = this.cards.filter(i => i.rarity === 'RARE');
            } else if(this.filterConditions.noCost) {
                out_filteredCards = this.cards.filter(i => i.cost === 'NO');
            } else if(this.filterConditions.oneCost) {
                out_filteredCards = this.cards.filter(i => i.cost === 'ON');
            } else if(this.filterConditions.twoCost) {
                out_filteredCards = this.cards.filter(i => i.cost === 'TW');
            } else if(this.filterConditions.threeCost) {
                out_filteredCards = this.cards.filter(i => i.cost === 'TH');
            } else if(this.filterConditions.sacrifice) {
                out_filteredCards = this.cards.filter(i => (i.cost === 'SO' || i.cost === 'ST' || i.cost === 'SH'));
            }

            return out_filteredCards;   
        } else {
            return null;
        }
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

.chip-container {
    display: block;
}

.chip-active{
    background-color: #1EAEDB;
    border-color: transparent;
    color:white;
}

.chip-active-common{
    background-color: #CC9480;
    border-color: #D99F7B;
    color:white;
}

.chip-active-uncommon{
    background-color: #F3EFF4;
    border-color: #C7CCE0;
    color:rgb(37, 41, 46);
}

.chip-active-rare{
    background-color: #FFB52C;
    border-color: #FBC828;
    color:#fff;
}

.chip-active-sacrifice{
    background-color: #E82452;
    border-color: transparent;
    color:#fff;
}

button, .button {
    display: inline;
    border-radius: 20px;
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