// Recipe Model
var Recipe = function(){
    return {
        name: '',
        image: null,
        description: '',
        ingredients: [''],
        directions: [''],
        rating: 0,
    }
};

// Initialize Firebasex
var config = {
    apiKey: "AIzaSyAwmIrD8YQBLGIhHNNrby7OIS9yOO91JiY",
    authDomain: "jsdemo-1bedd.firebaseapp.com",
    databaseURL: "https://jsdemo-1bedd.firebaseio.com",
    projectId: "jsdemo-1bedd",
    storageBucket: "jsdemo-1bedd.appspot.com",
    messagingSenderId: "1009293481641"
};
firebase.initializeApp(config);


// Create references to firestore and storage
var db = firebase.firestore();
var storage = firebase.storage().ref();
