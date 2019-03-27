Vue.component('potluckList', {
    props: {
        collection: {type: String},
        user: {type: Object},
    },

    data: function(){
        return {
            potlucks: null,
        };
    },

    firestore: function(){
        // set the potlucks collection based on the prop
        switch(this.collection){
            case 'archive':
                return {
                    potlucks: db.collection('potlucks').where('datetime', '<', new Date()).orderBy('datetime'),
                };
            case 'user':
                return {
                    potlucks: db.collection('potlucks').where('users', 'array-contains', this.user.uid),
                };
            default:
                return {
                    potlucks: db.collection('potlucks').where('datetime', '>', new Date()).orderBy('datetime'),
                };
        }
    },

    computed: {

    },

    methods: {

    },

    template: `
        <div class="potluck-list">
            <potluck v-if="potlucks" v-for="potluck in potlucks" :key="potluck.id" :potluck="potluck"></potluck>
            <loading v-else></loading>
        </div>
    `,

});

Vue.component('potluck', {
    props: {
        potluck: {type: Object, required: true},
    },

    computed: {

    },

    methods: {

    },

    template: `
       <div class="potluck">
            <router-link :to="{ name: 'potluck', params: { id: potluck.id }}" class="row">
                <div class="left-column">
                    <calendar-icon :date="potluck.datetime.toDate()"></calendar-icon>
                </div>
                <div  class="right-column">
                    <h3 v-if="potluck.name" class="name">{{potluck.name}}</h3>
                    <div v-if="potluck.description" class="description">{{potluck.description}}</div>
                    <div v-if="potluck.createdBy" class="created-by">
                        <b-img :src="potluck.createdBy.photoURL" class="avatar"></b-img>
                        {{potluck.createdBy.displayName}}
                    </div>
                </div>
            </router-link>
        </div>
    `,

});

Vue.component('potluckDetail', {
    props: {
        potluck: {type: Object, required: true},
        authUser: {required: true},
    },

    data: function(){
        return {
            guests: [],
            needs: [],
            newUnassignedNeed: new Need(),
            newAssignedNeed: new Need(),
        };
    },

    firestore: function(){
        return {
            guests: db.collection('potlucks').doc(this.potluck.id).collection('guests').orderBy('datetime'),
            needs: db.collection('potlucks').doc(this.potluck.id).collection('needs').orderBy('datetime'),
        };
    },

    computed: {
        loggedIn() {
            return (this.authUser && this.authUser.uid);
        },

        unassignedNeeds(){
            return this.needs.filter(function(need){
                return !need.assignedTo;
            })
        },

        assignedNeeds(){
            return this.needs.filter(function(need){
                return need.assignedTo;
            })
        },

        loggedInGuest(){
            if(this.authUser) {
                return this.guests.find(function(guest) {
                    return guest.user.uid == this.uid;
                }, this.authUser);
            }

            return null;
        },

        isHosting(){
            return this.potluck.createdBy.uid == this.authUser.uid;
        },

        isGuest(){
            if(this.loggedInGuest){
                return true;
            }

            return false;
        },

        isBringingSomething(){
            return this.bringing(this.authUser).length > 0;
        },

        formattedDate(){
            return this.potluck.datetime.toDate().toLocaleDateString()
        },

        formattedTime(){
            let t = this.potluck.datetime.toDate().toLocaleTimeString();
            let h = t.split(':')[0];
            let m = t.split(':')[1];

            return h + ':' + m + ' ' + t.split(' ')[1];
        }

    },

    methods: {
        joinIt(){
            if(!this.loggedInGuest) {
                let guest = new Guest();
                guest.user = this.authUser;

                // add to sub collection
                db.collection('potlucks').doc(this.potluck.id).collection('guests').add(guest);

                // add to array
                db.collection('potlucks').doc(this.potluck.id).update({users: firebase.firestore.FieldValue.arrayUnion(this.authUser.uid)});
            }
        },

        leaveIt(){
            if(this.loggedInGuest) {
                // remove from sub collection
                db.collection('potlucks').doc(this.potluck.id).collection('guests').doc(this.authUser.id).delete();

                // remove from array
                db.collection('potlucks').doc(this.potluck.id).update({users: firebase.firestore.FieldValue.arrayRemove(this.authUser.uid)});
            }
        },

        addNeed(theNeed){
            // set creation details
            theNeed.datetime = new Date();
            theNeed.createdBy = this.authUser;

            // add assigned user if it assigned
            if(theNeed === this.newAssignedNeed){
                theNeed.assignedTo = this.authUser;
            }

            // add to firebase
            db.collection('potlucks').doc(this.potluck.id).collection('needs')
                .add(theNeed)
                .then(function(docRef) {
                    console.log("Document written:", docRef);

                    // clear need
                    theNeed.name = '';
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);

                    // let the user know...
                    // TODO: let the user know
                });
        },

        bringIt(need){
            // update need
            db.collection('potlucks').doc(this.potluck.id)
                .collection('needs').doc(need.id)
                .update({assignedTo: this.authUser});
        },

        removeIt(need){
            if(need.assignedTo && need.createdBy.uid != need.assignedTo.uid) {
                // remove assignedTo
                db.collection('potlucks').doc(this.potluck.id)
                    .collection('needs').doc(need.id)
                    .update({assignedTo: null});
            }else{
                // remove completely
                db.collection('potlucks').doc(this.potluck.id)
                    .collection('needs').doc(need.id).delete();
            }
        },

        canRemoveIt(need) {
            return (need.createdBy.uid == this.authUser.uid || need.assignedTo.uid == this.authUser.uid);
        },

        bringing(user){
            var items = [];
            this.assignedNeeds.forEach(function(need){
                if(need.assignedTo.uid == user.uid){
                    items.push(need.name);
                }
            });

            return items;
        },

    },

    template: `
       <div class="potluck-detail">
            <b-row class="top-row">
                <div  class="left-column">
                    <h3 v-if="potluck.name" class="name">{{potluck.name}}</h3>
                    <div v-if="potluck.description" class="description">{{potluck.description}}</div>
                    <div class="details">
                        <i class="fas fa-calendar-day"></i> {{formattedDate}}<br>
                        <i class="fas fa-clock"></i> {{formattedTime}}<br>
                        <i class="fas fa-map-marker-alt"></i> {{potluck.location}}
                    </div>
                    
                </div>
                <div class="right-column">
                    <calendar-icon :date="potluck.datetime.toDate()"></calendar-icon>
                </div>
            </b-row>
            <b-row class="mt-3">
                <b-col v-if="loggedIn">
                    <b-tabs content-class="mt-3">
                        <b-tab title="Guests" active>
                            <b-container fluid>
                                <b-row>
                                    <b-col cols="auto" class="mr-auto" order="2" order-sm="1">
                                         <h5>Host</h5>
                                         <p>
                                             <b-img :src="potluck.createdBy.photoURL" class="avatar"></b-img>
                                             {{potluck.createdBy.displayName}}<br>
                                             <span v-if="bringing(this.potluck.createdBy).length" class="bringing">Bringing: {{bringing(this.potluck.createdBy).join(', ')}}</span>
                                         </p>
                                         <p>&nbsp;</p>
                                         <h5>Guests</h5>
                                         <p v-for="guest in guests" :key="guest.id">
                                             <b-img :src="guest.user.photoURL" class="avatar"></b-img>
                                             {{guest.user.displayName}}<br>
                                             <span v-if="bringing(guest.user).length" class="bringing">Bringing: {{bringing(guest.user).join(', ')}}</span>
                                         </p>
                                    </b-col>
                                    <b-col sm="auto" cols="12" class="p-3 text-center" order="1" order-sm="2">
                                        <b-button v-if="!isHosting && !isGuest" variant="primary" @click="joinIt"><i class="fas fa-user-plus"></i> Join It</b-button>
                                        <b-button v-else-if="!isHosting && isGuest && !isBringingSomething" variant="primary" @click="leaveIt"><i class="fas fa-user-times"></i> Leave It</b-button>
                                    </b-col>
                                    
                                </b-row>
                               
                            </b-container>
                        </b-tab>
                        <b-tab title="Needs">
                            <b-container fluid>
                                <b-row>
                                    <b-col sm="6" class="needs unassigned">
                                        <h5 class="border-bottom">Need It</h5>
                                        <div v-for="need in unassignedNeeds" :key="need.id" class="need">
                                            <i class="fas fa-clipboard"></i>
                                            <span>{{need.name}}</span>
                                            <b-button v-if="isHosting" variant="danger" size="sm" @click="removeIt(need)" title="Remove It">X</b-button>
                                            <b-button v-else-if="isGuest" variant="success" size="sm" @click="bringIt(need)">Bring It</b-button>
                                        </div>
                                        <b-form v-if="isHosting" @submit.prevent="addNeed(newUnassignedNeed)" inline>
                                            <i class="fas fa-clipboard"></i>
                                            <b-input v-model="newUnassignedNeed.name" size="sm" class="w-auto" aria-label="New need"></b-input>
                                            <b-button type="submit" size="sm">Need It</b-button>
                                        </b-form>
                                    </b-col>
                                    
                                    <b-col sm="6" class="needs assigned">
                                        <h5 class="border-bottom">Got It</h5>
                                        <div v-for="need in assignedNeeds" :key="need.id" class="need assigned">
                                            <i class="fas fa-clipboard-check"></i>
                                            <span>{{need.name}}</span>
                                            <b-button v-if="canRemoveIt(need)" variant="danger" size="sm" @click="removeIt(need)" title="Remove It">X</b-button>
                                        </div>
                                        <b-form v-if="isHosting || isGuest" @submit.prevent="addNeed(newAssignedNeed)" inline>
                                            <i class="fas fa-clipboard-check"></i>
                                            <b-input v-model="newAssignedNeed.name" size="sm" class="w-auto" aria-label="New need"></b-input>
                                            <b-button type="submit" size="sm">Bring It</b-button>
                                        </b-form>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-tab>
                        
                    </b-tabs>
                </b-col>
                <b-col v-else cols="9" class="mx-auto">
                    <b-alert variant="danger" class="mt-5 w-100" show>Please log in to view details.</b-alert>
                </b-col>
            </b-row>
        </div>
    `,

});

Vue.component('loading', {
    template: `
       <div>Loading...</div>
    `,

});

Vue.component('calendarIcon', {
    props: {
        date: {type: Date, required: true},
    },

    computed: {
        monthName(){
            let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

            return months[ this.date.getMonth() ];
        },
        dowName(){
            let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

            return days[ this.date.getDay() ];
        },
        dayNum(){
            return this.date.getDate();
        }
    },

    template: `
        <time :datetime="date.toISOString()" class="icon">
            <em>{{dowName}}</em>
            <strong>{{monthName}}</strong>
            <span>{{dayNum}}</span>
        </time>
    `,

});

Vue.component('navigation', {
    props: {
        authUser: {required: true},
    },

    methods: {
        login(){
            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth()
                .signInWithPopup(provider)
                .then(function(result){
                    let token = result.credential.accessToken;
            })
                .catch(function(error){
                let errorCode = error.code;
                let errorMessage = error.message;
            })
            // TODO: login with google
        },

        logout(){
            // TODO: logout
            firebase.auth().signOut();
        },
    },

    template: `
        <ul class="list-unstyled components">
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/my-potlucks">My Potlucks</router-link></li>
            <li><router-link to="/create">Create</router-link></li>
            <li><router-link to="/potlucks">Potlucks</router-link></li>
            <li><router-link to="/archive">Archive</router-link></li>
            <li v-if="authUser"><a href="#" @click.prevent="logout">Logout</a></li>
            <li v-else><a href="#" @click.prevent="login">Login</a></li>
        </ul>
    `,

});
