<template>
  <div>
    <add-cards></add-cards>
  </div>
</template>

<script>
import addCards from './components/addCards.vue'
import showCards from './components/showCards.vue'

export default {
  components:{
    'add-cards': addCards,
    'show-cards': showCards
  },
  data: function () {
    return {

    }
  }
}
</script>

<style>

</style>