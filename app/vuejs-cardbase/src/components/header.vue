<template>
  <nav>
      <ul>
          <li><router-link v-bind:to="'/library/' + id" exact>Library</router-link></li>
          <li><router-link v-bind:to="'/deck/' + id" exact>Deck</router-link></li>
          <li><router-link v-bind:to="'/packs/' + id" exact>Pack</router-link></li>
      </ul>
  </nav>
</template>

<script>

export default {
  data: function () {
    return {
        id: this.$route.params.id
    }
  },
  created(){
      this.id = this.$route.params.id;
      console.log(this.id);
  }
}
</script>

<style scoped>
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