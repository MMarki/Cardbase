import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Routes from './routes.js'

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes, //the array of routes from our routes.js
  mode: 'history'
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})
