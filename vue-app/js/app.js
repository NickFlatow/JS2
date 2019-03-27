var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    // data: all the data for the app
    data: {
        newItem: {
            title: '',
            author: '',
            genre:'',
            favorite: ''
        },
        message: 'Tartarus',
        bookList: [
            { title: 'The Tibetan Book of the Dead', author: 'W.Y. Evans-Wentz', genre:'non-fiction', image:'images/tibetan.jpg', favorite: false},
            { title: 'Seductive Interaction Design', author: 'Stephen Anderson', genre:'educational', image:'images/jsBook.jpg', favorite: false},
            { title: 'The Story of My Experiments with Truth', author: 'Mohandas Gandhi', genre:'autobiography', image:'images/gandhi.jpg', favorite: false},
            { title: 'Elon Musk Biography', author: 'Ashlee Vance', genre:'biography', image:'images/musk.jpeg', favorite: false}

        ],
        editBook: {

        }
    },
    // methods: usually "events" triggered by v-on:
    methods: {
        add: function(){
            this.bookList.push(this.newItem);

            //clear form
            this.newItem = { title: '', author: '', genre:''};

            //close modal
            $('#newModal').modal('hide');
        },
        update: function () {
            $('#editModal').modal('hide');
        },
        edit: function(book) {
            this.editBook = book;
            $('#editModal').modal('show');
        },
        remove: function(item){
            this.bookList.splice(this.bookList.indexOf(item),1);
        }

    },
    // computed: values that are updated and cached if dependencies change
    computed: {
        nonFictionList: function(){
            return this.bookList.filter(function(item){
                return item.genre === 'non-fiction';
            });
        },
        educationalList: function(){
            return this.bookList.filter(function(item){
               return item.genre === 'educational';
            });
        },
        autobiographyList: function(){
            return this.bookList.filter(function(item){
                return item.genre === 'biography' || item.genre === 'autobiography';
            });
        },
        favoriteList: function(){
            return this.bookList.filter(function(item) {
                return item.favorite == true;
            });
        }

    },
    //mounted:  called after the instance has been mounted,
    mounted: function() {

    },
    // watch: calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {

    }
});