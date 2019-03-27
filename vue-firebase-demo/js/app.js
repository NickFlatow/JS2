Vue.use(Vuefire);

// Initialize App
var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    // data: all the data for the app
    data: {
        newRecipe: {
            recipe: new Recipe(),
            image: null,
        },
        recipes: [], // placeholder until firebase data is loaded
        addRecipeModal: false, // show/hide modal
    },

    firestore: {
        // bind as an array by default
        recipes: db.collection('recipes'),
    },

    // methods: usually "events" triggered by v-on:
    methods: {
        addRecipe(){
            // create local reference to the newRecipe since "this"
            // will not reference the same "this" inside the Promise
            let theRecipe = this.newRecipe;

            // do some validation
            // TODO

            // add recipe to firebase
            db.collection('recipes')
                .add(theRecipe.recipe)
                .then(function(docRef){
                   console.log('Document added:', docRef);

                   // upload image
                   app.addImage(docRef.id);
                   //clear form
                   theRecipe.recipe = new Recipe();
                })
                .catch(function(error){
                    console.log('Error adding recipe:',error);

                    //TODO let the user know
                });
        },
        addImage(docId){
            // docId and image file are required
            if(!docId || !this.newRecipe.image){
                return false;
            }

            // create a filename we know will be unique
            // the other option would be to create a folder for each recipe
            let theRecipe = this.newRecipe;
            let allowedTypes = ['jpg', 'png', 'gif'];
            let extension = theRecipe.image.name.toLowerCase().split('.').pop()

            // validate extension
            if(allowedTypes.indexOf(extension) < 0){
                // invalid extension

                // let the user know...
                // TODO: let the user know WITHOUT alerts
                alert('Invalid file type.');

                return false;
            }

            // validate size (less than 200KB
            if(theRecipe.image.size > (200 * 1024)){
                // file too large

                // let the user know...
                // TODO: let the user know WITHOUT alerts
                alert('File too large. 200KB max');

                return false;
            }

            // add image to firebase
            storage.child('recipes').child(docId)
                .put(theRecipe.image)
                .then(function(snapshot){
                    console.log('Uploaded file',snapshot);

                    //update recipe with the image url
                    snapshot.ref.getDownloadURL().then(function(url){
                       db.collection('recipes').doc(docId).update({image: url});
                    });

                    // clear form input
                    theRecipe.image = null;

                })
                .catch(function(error){
                    console.log('Error adding recipe:',error);




                    //TODO let the user know
                });
        }
    },

    // computed: values that are updated and cached if dependencies change
    computed: {

    },

    //mounted:  called after the instance has been mounted,
    mounted: function() {

    },

    // watch: calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {

    }
});

