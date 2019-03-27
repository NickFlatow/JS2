Vue.component('list', {
    //props: ['items'] or
    props: {
        items: {
            type: Array,
            required: true
        },
        name:{
            type: String,
            default: 'Get it'
        }
    },
    methods: {
        add:function(item){
            // item.qty++;

        },
        subtract:function(item){
            if(item.qty > 0) {
                item.qty--;
            }

            if(item.qty == 0){
                //remove it, by triggering an event
                console.log(item);
                this.$emit('remove-item',item);
            }
        }
    },
    template: '' +
        '           <div class="get-it-list">\n' +
        '                <h3>{{name}}</h3>\n' +
        '                <ul class="list-group list-group-flush">\n' +
        '                    <li v-for="(item, i) in items" :key="item.name"class="list-group-item">\n' +
        '                        <div class="custom-control custom-checkbox">\n' +
        '                            <!--v-bind: id=... same as :id=-->\n' +
        '                            <input type="checkbox" :id="`${name}-${i}`" v-model="item.purchased" class="custom-control-input">\n' +
        '                            <label :for="`${name}-${i}`" class="custom-control-label" :class="{purchased: item.purchased}">{{item.name}}</label>\n' +
        '                        </div>\n' +
        '                        <div class=" d-flex justify-content-between">\n' +
        '                            <div>\n' +
        '                                <small>Qty: {{item.qty}}</small>\n' +
        '                            </div>\n' +
        '                            <div>\n' +
        '                                <button class="btn btn-tiny" @click="add(item)"><i class="fas fa-plus-circle"></i></button>\n' +
        '                                <button class="btn btn-tiny" @click="subtract(item)" data-toggle="modal" data-target="#addItemModal"><i class="fas fa-minus-circle"></i></button>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </li>\n' +
        '                </ul>\n' +
        '                <p>\n' +
        '                    <small>Total: {{items.length}}</small>\n' +
        '                </p>\n' +
        '            </div>',

    computed: {

    }
});