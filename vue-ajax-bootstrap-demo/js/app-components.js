Vue.component('book', {
    props: {
        favorites: {type: Array, required: true},
        bookmarks: {type: Array, required: true},
        book: {type: Object, required: true},
    },

    data: function(){
        return {
            showDetails: false,
        };
    },

    computed: {
        thumbnail(){
            return this.book.volumeInfo.imageLinks.thumbnail.replace('&edge=curl', '');
        },
        fullSizeImage(){
            return this.thumbnail.replace('zoom=1', 'zoom=3');
        },
        bookIdModal(){
            return "book" + this._uid + "modal";
        },
        favorite(){
            return this.favorites.contains(this.book);
        },
        bookmarked(){
            return this.bookmarks.contains(this.book);
        },
    },

    methods: {
        displayDetails(){
            this.showDetails = true;
        },

        addFavorite(){
            this.favorites.add(this.book);
        },
        removeFavorite(){
            this.favorites.remove(this.book);
        },

        addBookmark(){
            this.bookmarks.add(this.book);
        },
        removeBookmark(){
            this.bookmarks.remove(this.book);
        },
    },

    template: `
        <b-col class="shelf" lg="2" md="3" sm="4" cols="6">
            
            <!-- BOOK THUMBNAIL -->
            <div class="book">
                <b-img :src="thumbnail" :alt="book.volumeInfo.title" @click="displayDetails" class="thumbnail"></b-img>
                <b-button-toolbar>
                    <b-button-group>
                        <b-button @click="displayDetails" title="More Info"><i class="fas fa-info-circle"></i></b-button>
                        
                        <b-button v-if="bookmarked" title="Remove Bookmark" @click="removeBookmark"><i class="fas fa-bookmark"></i></b-button>
                        <b-button v-else title="Add Bookmark" @click="addBookmark"><i class="far fa-bookmark"></i></b-button>
                        
                        <b-button v-if="favorite" title="Remove Favorite" @click="removeFavorite"><i class="fas fa-heart"></i></b-button>
                        <b-button v-else title="Add Favorite" @click="addFavorite"><i class="far fa-heart"></i></b-button>
                    </b-button-group>
                </b-button-toolbar>
            </div>
            
            <!-- BOOK MODAL -->
            <b-modal v-model="showDetails" size="xl" class="book-details" :title="book.volumeInfo.title" cancel-disabled lazy hide-footer header-bg-variant="primary" header-text-variant="light">
                <b-container fluid>
                    <b-row>
                        <b-col sm="4" class="text-center col-preview">
                            <b-img :src="fullSizeImage" :alt="book.volumeInfo.title" fluid-grow></b-img>
                            
                            <b-button v-if="book.accessInfo.webReaderLink" :href="book.accessInfo.webReaderLink" target="_blank" variant="primary" class="m-2">Preview</b-button>
                            <b-button v-if="book.saleInfo.buyLink" :href="book.saleInfo.buyLink" target="_blank" variant="primary" class="m-2">Buy Now</b-button>
                        </b-col>
                        <b-col sm="8" class="text-left col-details">
                            <dl>
                                <template v-if="book.volumeInfo.authors">
                                    <dt>{{book.volumeInfo.authors.length > 1 ? 'Authors' : 'Author'}}</dt>
                                    <dd>{{book.volumeInfo.authors.join(',')}}</dd>
                                </template>
                                
                                <template v-if="book.volumeInfo.categories">
                                    <dt>{{book.volumeInfo.categories.length > 1 ? 'Categories' : 'Category'}}</dt>
                                    <dd>{{book.volumeInfo.categories.join(',')}}</dd>
                                </template>
                                
                                <template v-if="book.volumeInfo.publisher">
                                    <dt>Publisher</dt>
                                    <dd>{{book.volumeInfo.publisher}}</dd>
                                </template>
                                
                                <template v-if="book.volumeInfo.pageCount">
                                    <dt>Pages</dt>
                                    <dd>{{book.volumeInfo.pageCount}}</dd>
                                </template>
                                
                                <template v-if="book.volumeInfo.description">
                                    <dt>Description</dt>
                                    <dd>{{book.volumeInfo.description}}</dd>
                                </template>                                    
                            </dl>
                        </b-col>
                    </b-row>
                </b-container>
            </b-modal>
            
        </b-col>
    `,

});