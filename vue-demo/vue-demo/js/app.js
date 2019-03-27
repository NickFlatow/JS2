var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',
    // data: all the data for the app
    data: {
        newItem: {
            name: '',
            qty: 1,
            category: 'need'
        },
        shoppingList: [
            { name: 'Hammer', qty: 1, purchased: true, category: 'need' },
            { name: 'Nails', qty: 10, purchased: false, category: 'need'},
            { name: 'Sliding Compound Miter Saw', qty: 1, purchased: false, category: 'want'}
        ],
    },
    // methods: usually "events" triggered by v-on:
    methods: {
        // also seen as
        // add(){...}
        add: function(){

            this.shoppingList.push(this.newItem);

            //clear form
            this.newItem = { qty: 1, category: 'need'};

            //close modal
            $('#addItemModal').modal('hide');
        },

        remove: function(item){
            this.shoppingList.splice(this.shoppingList.indexOf(item),1  );
        }
    },
    // computed: values that are updated and cached if dependencies change
    computed: {

        needList: function(){
            return this.shoppingList.filter(function(item){
               return !item.purchased && item.category === 'need';
            });
        },
        gotList: function(){
            return this.shoppingList.filter(function(item){
                return  item.purchased;
            });
        },
        wantList: function(){
            return this.shoppingList.filter(function(item){
                return !item.purchased && item.category === 'want';
            });
        }
    },
    //mounted:  called after the instance has been mounted,
    mounted: function() {
        // if list is in local storage, replace the default one
        if(localStorage.getItem('shoppingList')){
            this.shoppingList = JSON.parse(localStorage.getItem('shoppingList'));
        }
    },
    // watch: calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {
        // call this fucntion whenever shoppingList changes
        shoppingList: {
            handler: function(newList){
                // newList is the new list BEFORE it updates the model
                localStorage.setItem('shoppingList',JSON.stringify(newList));
            },
            // tells vue to look at nested properties
            deep:true
        }
    }
});