Vue.component('bookmodal', {
    //props: ['items'] or
    props: {
        book: {
            type: Object,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        header:{
            type: String,
            required: true
        }
    },
    methods: {
        save: function(){
            this.$emit('savebook');
        },
        fav: function(){
            this.book.favorite = !this.book.favorite;
            $('#editModal').modal('hide');
        },
        remove: function(){
            this.$emit('remove',this.book);
        }

    },
    template: ''+
        '    <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">\n' +
        '        <div class="modal-dialog" role="document">\n' +
        '            <form>\n' +
        '                <div class="modal-content">\n' +
        '                    <div class="modal-header">\n' +
        '                        <i class="fa-heart" :class="{fas: book.favorite, far: !book.favorite}" @click="fav"></i> '+
        '                        <h5 class="modal-title" id="modalTitle"> ??????? </h5>\n' +
        '                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
        '                            <span aria-hidden="true">&times;</span>\n' +
        '                        </button>\n' +
        '                    </div>\n' +
        '                    <div class="modal-body">\n' +
        '                        <div class="form-group">\n' +
        '                            <label for="title">Title</label>\n' +
        '                            <input id="title" type="text" class="form-control" v-model="book.title">\n' +
        '                        </div>\n' +
        '                        <div class="form-group">\n' +
        '                            <label for="author">Author</label>\n' +
        '                            <input id="author" type="text" class="form-control" v-model="book.author">\n' +
        '                        </div>\n' +
        '                        <div class="form-group">\n' +
        '                            <label for="genre">Category</label>\n' +
        '                            <select id="genre" class="form-control" v-model="book.genre">\n' +
        '                                <option value="autobiography">Autobiography/Biography</option>\n' +
        '                                <option value="educational">Educational</option>\n' +
        '                                <option value="non-fiction">Non-fiction</option>\n' +
        '                            </select>\n' +
        '                        </div>\n' +
        '                        <div class="form-group">\n' +
        '                            <label for="image">Cover</label><br>\n' +
        '                            <button id="image">Add Cover Image</button>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="modal-footer">\n' +
        '                        <button type = "button" class="btn btn-danger mr-auto"@click.prevent="remove">Remove </button>\n ' +
        '                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Forget It</button>\n' +
        '                        <button type="button" class="btn btn-primary" @click.prevent="save">Save Book</button>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </form>\n' +
        '        </div>\n' +
        '    </div>',
    computed: {

    }
});