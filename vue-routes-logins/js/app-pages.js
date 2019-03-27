/*
 * Pages/views need variables to reference the component
 * but are otherwise treated the same as components.
 * Again... think components, not templates/views
*/

const HomePage = Vue.component('HomePage', {
    props: {
        authUser: {required: true},
    },

    template: `
        <div class="home page">
            <div class="text-center">
                <b-img src="images/logo.png" responsive class="logo" alt="Bring It Logo"></b-img>
            </div>
             
            <div>
                <b-card-group deck>
                  <b-card header="Create a Potluck" border-variant="primary" header-bg-variant="primary" header-text-variant="light" align="center">
                    <b-card-text>
                        <i class="fas fa-clipboard"></i><br>
                        <p>Create your potluck event page.</p>
                        <b-button variant="secondary" @click="$router.push('create')">Get Started</b-button>
                    </b-card-text>
                  </b-card>
            
                  <b-card header="Join a Potluck" border-variant="primary" header-bg-variant="primary" header-text-variant="light" align="center">
                    <b-card-text>
                        <i class="fas fa-clipboard-list"></i><br>
                        <p>Find a potluck to join.</p>
                        <b-button variant="secondary" @click="$router.push('potlucks')">Upcoming Potlucks</b-button>
                    </b-card-text>
                  </b-card>
            
                  <b-card header="Bring It" border-variant="primary" header-bg-variant="primary" header-text-variant="light" align="center">
                    <b-card-text>
                        <i class="fas fa-clipboard-check"></i><br>
                        <p>See what you are signed up to bring!</p>
                        <b-button variant="secondary" @click="$router.push('my-potlucks')">My List</b-button>
                    </b-card-text>
                  </b-card>
                </b-card-group>
              </div>
        </div>
    `,
});

const CreatePotluckPage = Vue.component('CreatePotluckPage', {
    props: {
        authUser: {required: true},
    },

    data: function(){
        return {
            newPotluck: new Potluck(),
        };
    },

    computed: {
        loggedIn() {
            return (this.authUser && this.authUser.uid);
        },
    },

    methods: {
        addPotluck(){
            var thePotluck = this.newPotluck;

            // set datetime
            let d = thePotluck.date.split('-');
            let t = thePotluck.time.split(':');
            thePotluck.datetime = new Date(d[0], d[1], d[2], t[0], t[1], 0);

            // remove other properties from object
            delete thePotluck.date;
            delete thePotluck.time;

            // set author
            thePotluck.createdBy = this.authUser;

            // add user
            thePotluck.users.push(this.authUser.uid);

            // add potluck to firebase
            db.collection('potlucks')
                .add(thePotluck)
                .then(function(docRef) {
                    console.log("Document written:", docRef);

                    // clear potluck
                    thePotluck = new Potluck();

                    // redirect to that potluck
                    router.push({ name: 'potluck', params: { id: docRef.id } })

                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);

                    // let the user know...
                    // TODO: let the user know
                });
        }
    },

    template: `
        <div class="create page">
            <h2>Create Potluck</h2>
            <b-form v-if="loggedIn" @submit.prevent="addPotluck">
                <b-form-group label="Name" label-for="name" class="col-md-12">
                    <b-form-input id="name" v-model="newPotluck.name" required></b-form-input>
                </b-form-group>
                
                <b-form-group label="Date" label-for="date" class="col-md-6">
                    <b-form-input id="date" v-model="newPotluck.date" type="date" required></b-form-input>
                </b-form-group>
                
                <b-form-group label="Time" label-for="time" class="col-md-6">
                    <b-form-input id="time" v-model="newPotluck.time" type="time" required></b-form-input>
                </b-form-group>
                
                <b-form-group label="Location" label-for="location" class="col-md-12">
                    <b-form-input id="location" v-model="newPotluck.location" required></b-form-input>
                </b-form-group>
                
                <b-form-group label="Description" label-for="description" class="col-md-12">
                    <b-form-textarea id="description" v-model="newPotluck.description" rows="5" max-rows="5" required></b-form-textarea>
                </b-form-group>
                
                <div class="col-md-12">
                    <b-button type="submit" variant="primary">Submit</b-button>
                </div>
            </b-form>
            <b-col v-else cols="9" class="mx-auto">
                <b-alert variant="danger" class="mt-5 w-100" show>Please log in to create a potluck.</b-alert>
            </b-col>
        </div>
    `,
});

const MyPotlucksPage = Vue.component('MyPotlucksPage', {
    props: {
        authUser: {required: true},
    },

    computed: {
        loggedIn() {
            return (this.authUser && this.authUser.uid);
        },
    },

    template: `
        <div class="potlucks page">
            <h2>My Potlucks</h2>
            <potluck-list collection="user" v-if="loggedIn" :user="authUser"></potluck-list>
            <b-col v-else cols="9" class="mx-auto">
                <b-alert variant="danger" class="mt-5 w-100" show>Please log in to view your potlucks.</b-alert>
            </b-col>
        </div>
    `,

});

const PotlucksPage = Vue.component('PotlucksPage', {
    props: {
        authUser: {required: true},
    },

    template: `
        <div class="potlucks page">
            <h2>Upcoming Potlucks</h2>
            <potluck-list collection="upcoming"></potluck-list>
        </div>
    `,

});

const ArchivePage = Vue.component('ArchivePage', {
    props: {
        authUser: {required: true},
    },

    template: `
        <div class="potlucks page">
            <h2>Past Potlucks</h2>
            <potluck-list collection="archive"></potluck-list>
        </div>
    `,

});

const PotluckPage = Vue.component('PotluckPage', {
    props: {
        id: {type: String, required: true, default: ''},
        authUser: {required: true},
    },

    data: function(){
        return {
            potluck: null,
        };
    },

    firestore: function(){
        return {
            potluck: db.collection('potlucks').doc(this.id),
        };
    },

    template: `
        <div class="potlucks page">
            <potluck-detail v-if="potluck" :potluck="potluck" :auth-user="authUser"></potluck-detail>
            <loading v-else></loading>
        </div>
    `,

});
