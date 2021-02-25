import login from './components/login.vue';
import showCards from './components/showCards.vue';
import addCards from './components/addCards.vue';
import buildDeck from './components/buildDeck.vue';

export default [
    {path: '/', name: 'login', component: login},
    {path: '/library/', name: 'library', component: showCards},
    {path: '/packs/', name: 'packs', component: addCards},
    {path: '/deck/', name: 'deck', component: buildDeck}
]