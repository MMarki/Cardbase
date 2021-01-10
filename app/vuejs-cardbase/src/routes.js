import login from './components/login.vue';
import showCards from './components/showCards.vue';
import addCards from './components/addCards.vue';
import buildDeck from './components/buildDeck.vue';

export default [
    {path: '/', name: 'login', component: login},
    {path: '/library/:id', name: 'library', component: showCards},
    {path: '/packs/:id', name: 'packs', component: addCards},
    {path: '/deck/:id', name: 'desk', component: buildDeck}
]