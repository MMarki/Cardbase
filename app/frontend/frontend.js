new Vue({
    el: '#vue-app',
    data: {
        card: 27,
    },
    methods: {
        add: function() {
            this.card++;
        },
        subtract: function() {
            this.card--;
        }
    }
})