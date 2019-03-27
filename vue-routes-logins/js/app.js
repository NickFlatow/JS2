// Include Firebase plugin
Vue.use(Vuefire);

// Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes: [
            { path: '/', component: HomePage }, // default page
            { name: 'home', path: '/home', component: HomePage },
            { name: 'mypotlucks', path: '/my-potlucks', component: MyPotlucksPage },
            { name: 'create', path: '/create', component: CreatePotluckPage },
            { name: 'potlucks', path: '/potlucks', component: PotlucksPage },
            { name: 'archive', path: '/archive', component: ArchivePage },
            { name: 'potluck', path: '/potluck/:id', component: PotluckPage, props: true},
        ],
});

// Initialize App
var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',
    router: router,
    // data: all the data for the app
    data: {
        newPotluck: new Potluck(),
        potlucks: [], // placeholder until firebase data is loaded
        addPotluckModal: false, // show/hide modal
        authUser: null,
    },

    // methods: usually "events" triggered by v-on:
    methods: {

    },

    // computed: values that are updated and cached if dependencies change
    computed: {

    },

    //mounted:  called after the instance has been created,
    created: function() {
        // TODO: onAuthStateChanged()
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                console.log('Signed in as: ', user);

                app.authUser = new User(user);

            } else {
                // User is signed out.
                console.log('Not signed in.');

                app.authUser = null;
            }
        });
    },

    // watch: calls the function if the value changes
    watch: {

    }
});

