<template>
  <nav>
      <ul>
          <li><router-link v-bind:to="'/library/'" exact>Library</router-link></li>
          <li><router-link v-bind:to="'/deck/'" exact>Deck</router-link></li>
          <li><router-link v-bind:to="'/packs/'" exact>Packs</router-link></li>
      </ul>
  </nav>
</template>

<script>

export default {
  data: function () {
    return {
        id: (document.cookie).split('; ').find(row => row.startsWith('user=')).split('=')[1],
    }
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