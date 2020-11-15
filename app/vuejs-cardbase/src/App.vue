<template>
  <div>
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import addCards from './components/addCards.vue'
import showCards from './components/showCards.vue'
import header from './components/header.vue'
import login from './components/login.vue'

export default {
  components:{
    'add-cards': addCards,
    'show-cards': showCards,
    'app-header': header,
    'login': login
  },
  data: function () {
    return {

    }
  }
}
</script>

<style>

</style>