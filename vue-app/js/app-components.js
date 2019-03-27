Vue.component('list', {
    //props: ['items'] or
    props: {
        items: {
            type: Array,
            required: true
        },
        name: {
            type: String,
            default: 'Genre'
        }
    },
    methods: {
        edit: function(item){
            this.$emit('edit',item);
        }
    },
    template: ''+
        '         <div>'+
        '           <h1>{{name}}</h1>\n' +
        '            <div class = "row">\n' +
        '                <div class ="col" v-for="item in items"><img :src ="`${item.image}`" height="150" width="150" @click="edit(item)" data-toggle="modal" data-target="#modalEdit"></div>\n' +
        '            </div>' +
        '         </div>',
    computed: {

    }
});