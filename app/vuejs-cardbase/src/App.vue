<template>
  <div>
    <app-header v-if="['library', 'deck', 'packs'].includes($route.name)"></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import addCards from './components/addCards.vue'
import showCards from './components/showCards.vue'
import buildDeck from './components/buildDeck.vue'
import header from './components/header.vue'
import login from './components/login.vue'

export default {
  components:{
    'add-cards': addCards,
    'show-cards': showCards,
    'build-deck': buildDeck,
    'app-header': header,
    'login': login
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