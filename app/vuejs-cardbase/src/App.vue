<template>
  <div>
    
    <router-view @updateStatus="updateNav"></router-view>
  </div>
</template>

<script>
import addCards from './components/addCards.vue'
import showCards from './components/showCards.vue'
import buildDeck from './components/buildDeck.vue'
//import header from './components/header.vue'
import login from './components/login.vue'

export default {
  components:{
    'add-cards': addCards,
    'show-cards': showCards,
    'build-deck': buildDeck,
    //'app-header': header,
    'login': login
  },
  methods: {
    updateNav: function (){
      console.log('UPDATING NAV');
    }
  },
  data: function () {
    return {
      id: ''
    }
  }
}
</script>

<style>

</style>