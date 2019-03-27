const STATUS = {POSTED: '', ARCHIVED: 'archive', TRASHED: 'trash'};

function Note(title, text, color) {
    this.title = title || '';
    this.text = text || '';
    this.color = color || 'yellow';
    this.editing = false;
    this.status = STATUS.POSTED;

    this.archived = function(){
        return this.status === STATUS.ARCHIVED;
    };

    this.trashed = function(){
        return this.status === STATUS.TRASHED;
    };
}

var app = new Vue({
    el: '#app',
    data: {
        drawer: null,
        menuItems: [
            {icon: 'notes', text: 'Notes'},
            {icon: 'archive', text: 'Archive'},
            {icon: 'delete', text: 'Trash'},
            {divider: true},
            {icon: 'settings', text: 'Settings'},
            {icon: 'help', text: 'Help'},
            {icon: 'info', text: 'About'},
        ],
        notes: [
            //new Note("Lorem ipsum 3", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pretium sit amet lacus eu consectetur. Suspendisse vitae quam vitae mi laoreet pellentesque id id diam. Sed tempus gravida quam, et varius ex aliquam et.", "blue"),
            //new Note("Lorem ipsum 2", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pretium sit amet lacus eu consectetur. Suspendisse vitae quam vitae mi laoreet pellentesque id id diam. Sed tempus gravida quam, et varius ex aliquam et.", "green"),
            //new Note("Lorem ipsum 1", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pretium sit amet lacus eu consectetur. Suspendisse vitae quam vitae mi laoreet pellentesque id id diam. Sed tempus gravida quam, et varius ex aliquam et.", "red"),
        ],
        colors: ['red', 'orange', 'yellow', 'lime', 'green', 'teal', 'blue', 'purple', 'pink'],
        searching: false,
        searchTerm: '',
        snackbarDisplay: false,
        snackbarTimeout: 3000,
        pickingColor: [],
        showStatus: STATUS.POSTED
    },
    methods: {
        navigate: function(item){
            switch(item.text){
                case "Notes":
                    this.showStatus = STATUS.POSTED;
                    break;
                case "Archive":
                    this.showStatus = STATUS.ARCHIVED;
                    break;
                case "Trash":
                    this.showStatus = STATUS.TRASHED;
                    break;
                default:
                    this.snackbarDisplay = true; // show snackbar
                    break;
            }

            // close drawer
            this.drawer = false;
        },

        setColor: function(note, color){
            note.color = color;
            this.pickingColor = false;
        },

        addNote: function(){
            this.notes.unshift(new Note());
        },

        editNote: function(note){
            note.editing = true;
        },

        saveNote: function(note){
            note.editing = false;
        },

        archiveNote: function(note){
            note.status = STATUS.ARCHIVED;
            this.saveNote(note);
        },

        trashNote: function(note){
            note.status = STATUS.TRASHED;
            this.saveNote(note);
        },

        restoreNote: function(note){
            note.status = STATUS.POSTED;
            this.saveNote(note);
        },

        duplicateNote: function(note){
            this.notes.splice(this.notes.indexOf(note), 0, Object.assign({}, note));

        }
    },

    computed: {
        filteredNotes: function(){
            let keyword = this.searchTerm.toLowerCase();
            let status = this.showStatus;
            if(keyword){
                return this.notes.filter(function(note){
                    return note.status === status && (note.title.toLowerCase().search(keyword) >= 0 || note.text.toLowerCase().search(keyword) >= 0);
                });
            }else{
                return this.notes.filter(function(note){
                    return note.status === status;
                });
            }
        }
    },

});

// modify colors on the fly
app.$vuetify.theme.primary = '#ffcc00';

