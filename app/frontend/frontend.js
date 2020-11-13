Vue.component('greeting',{
    template: '<p>I am {{ name }} <button v-on:click="changeName">Change Name</button></p>',
    data: function(){
        return {
            name: 'Yoshi'
        }
    },
    methods: {
        changeName: function(){
            this.name = 'Mario';
        }
    }
});

let one = new Vue({
    el: '#vue-app-one',
    data: {
        title: 'Vue App One'
    },
    methods: {
        greet: function() {
            return 'Hello from app one :)';
        }
    },
    computed: {
        
    }
});

let two = new Vue({
    el: '#vue-app-two',
    data: {
        title: 'Vue App Two'
    },
    methods: {
        greet: function() {
            return 'Hello from app two :)';
        },
        changeTitle: function(){
            one.title = "I've been changed!";
        }
    },
    computed: {
        
    }
});