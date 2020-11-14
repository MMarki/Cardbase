import showCards from './components/showCards.vue';
import addCards from './components/addCards.vue';

export default [
    {path: '/', component: showCards},
    {path: '/packs', component: addCards}
]