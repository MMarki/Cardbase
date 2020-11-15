import login from './components/login.vue';
import showCards from './components/showCards.vue';
import addCards from './components/addCards.vue';

export default [
    {path: '/', component: login},
    {path: '/library', component: showCards},
    {path: '/packs', component: addCards}
]