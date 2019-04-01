
var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    data: {
        weeklySession: new Session(),
        stepsBucket: null,
        //on success of ajax call in getStepsBucket() loggedIn is set to true
        loggedIn: false
    },

    methods:{
        // handleClientLoad() {
        //     // Load the API's client and auth2 modules.
        //     gapi.load('client:auth2', authClient);
        //
        //     function authClient() {
        //         gapi.auth2.authorize({
        //             client_id: '136129714002-ppsnkh4o55ai8bq6ttgrpfker688s4u4.apps.googleusercontent.com',
        //             scope: 'https://www.googleapis.com/auth/fitness.activity.read',
        //             response_type: 'id_token permission'
        //         }, function (response) {
        //             // console.log(response);
        //             if (response.error) {
        //                 // An error happened!
        //                 alert('Token Error!');
        //                 return;
        //             }
        //             //save token to local storage
        //             localStorage.setItem('token', response.access_token);
        //             alert("Jello!")
        //             console.log("client_access_token " + response.access_token);
        //
        //         });
        //     }
        // },
        login(){
            gapi.load('client:auth2', app.authClient);
        },
        login2(){
            app.getData();
            app.getStepsBucket();
        },
        authClient(){
            gapi.auth2.authorize({
                client_id: '136129714002-ppsnkh4o55ai8bq6ttgrpfker688s4u4.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/fitness.activity.read',
                response_type: 'id_token permission'
            }, function (response) {
                // console.log(response);
                if (response.error) {
                    // An error happened!
                    alert('Token Error!');
                    return;
                }
                //save token to local storage
                localStorage.setItem('token', response.access_token);

                app.getData();
                app.getStepsBucket();



            });
        },
        // login(){
        //     gapi.load('client:auth2', app.authClient);
        //     // this.handleClientLoad();
        //     let provider = new firebase.auth.GoogleAuthProvider();
        //     // provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');
        //
        //     firebase.auth()
        //         .signInWithPopup(provider)
        //         .then(function(result){
        //             // app.getStepsBucket();
        //
        //             let token = result.credential.accessToken;
        //             // console.log("firebase " + token);
        //             // localStorage.setItem('token', token);
        //             app.authCode = 'Bearer '+ token;
        //             console.log('app.authCode ' + app.authCode);
        //         })
        //         .catch(function(error){
        //             let errorCode = error.code;
        //             let errorMessage = error.message;
        //         })
        //
        // }
        //
        logout(){
            firebase.auth().signOut();
        },
        toggle(){
          this.loggedIn = !this.loggedIn
        },
        getData(){
            // var authCode = app.authCode;
            var authCode = 'Bearer ' + localStorage.getItem('token');
            // console.log(authCode);
            // console.log(accessToken);
            // var req_url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
            //get today's date

            //get the first day of the current week
            var sunday = new Date(this.getDayOfWeek(0));
            //get the last day of the current week
            var saturday = new Date(this.getDayOfWeek(6));
            // console.log("Sunday: " + sunday + " " + "Saturday: " + saturday);

            var req_url = "https://www.googleapis.com/fitness/v1/users/me/sessions?"+
                "startTime="+sunday.getFullYear()+'-'+(sunday.getMonth() + 1)+'-'+sunday.getDate()+"T00:00:00.000Z"+
                "&endTime="+saturday.getFullYear()+'-'+(saturday.getMonth() + 1)+'-'+saturday.getDate()+"T23:59:59.999Z";

            axios.get(req_url, { headers: { Authorization: authCode } }).then(response => {
                this.weeklySession = new Session(response.data.session);
                // console.log(this.weeklySession)
                // console.log(response.data.session);
                })
                .catch((error) => {
                    console.log('token error ' + error);
                    //refresh token
                });
        },
        getStepsBucket(){
            // var authCode = 'Bearer ya29.GlvZBivBWPZyXxZlkyuZOQBg8XVVtrGK62DwOCwNAMJYD2X4fjGSpoPE4B6-1yEj03aiaunCpAxoRg0PLNVaYVCafqyXLIesgKxIPLVtwRu68LE1uW813E6OIWS8'
            var authCode = 'Bearer ' + localStorage.getItem('token');
            // console.log(authCode);
            // we use different device uid to distinguish different data sources of a same type.
            var req_url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
            // You may need dsId.
            // var dsId = "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps";
            let sunday = new Date(this.getDayOfWeek(0));
            let saturday = new Date(this.getDayOfWeek(6));
            $.ajax({
                type: "POST",
                url: req_url,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "aggregateBy": [{
                        "dataTypeName": "com.google.step_count.delta",
                        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                    }],
                    "bucketByTime": { "durationMillis": 86400000 },
                    // get start of day in milliseconds
                    "startTimeMillis": sunday.setHours(0,0,0,0),
                    // get end of the day in milliseconds
                    "endTimeMillis": saturday.setHours(23,59,59,999)
                }),

                beforeSend : function( xhr ) {
                    xhr.setRequestHeader('Authorization', authCode);
                },
                success: function (response) {
                    app.stepsBucket = new Session(response.bucket);
                    app.loggedIn = true
                    // console.log(stepsBucket);
                    // console.log(response.bucket[0].dataset[0].point[0].value[0].intVal);
                },
                failure: function(errMsg) {
                    //get new access token
                    alert(errMsg);
                }
            });
        },
        //Returns day of the week
        //day is an int 0-6 representing the day; Sunday = 0, Saturday = 6
        getDayOfWeek(day){
            var date = new Date();
            var today = date.getDay();
            var dayOfWeek;
            //if the day is Saturday
            if (date.getDay == day){
                dayOfWeek = new Date().setDate(date.getDate());
            }
            else{
                dayOfWeek = new Date().setDate((date.getDate() - today) + day)
            }
            return dayOfWeek;
        },
        getDayList(day){
            //get day of the week
            let theDay = new Date(this.getDayOfWeek(day));
            // get start of day in milliseconds
            let startOfDay = theDay.setHours(0,0,0,0)
            // get end of the day in milliseconds
            let endOfDay = theDay.setHours(23,59,59,999);
            // console.log("End of day: " + day + " " + endOfDay);
            // console.log("Start of day: "+ day + " " + startOfDay);
            return this.weeklySession.filter(function(item){
                return item.endTimeMillis < endOfDay && item.startTimeMillis > startOfDay;
            });
        },
        getDailyActivity(day,at){
            //get day of the week
            let theDay = new Date(this.getDayOfWeek(day));
            // get start of day in milliseconds
            let startOfDay = theDay.setHours(0,0,0,0)
            // get end of the day in milliseconds
            let endOfDay = theDay.setHours(23,59,59,999);
            // console.log("End of day: " + day + " " + endOfDay);
            // console.log("Start of day: "+ day + " " + startOfDay);
            return this.weeklySession.filter(function(item){
                return item.activityType === at && item.endTimeMillis < endOfDay && item.startTimeMillis > startOfDay;
            });
        },
        getBucket(day){
            console.log("day: " + day);
            console.log(this.stepsBucket[day]);
            if (this.stepsBucket[day].dataset[0].point[0] === undefined){
                return 0;
            }else{
                return this.stepsBucket[day].dataset[0].point[0].value[0].intVal;
            }
        },
        getWeeklySteps(){
           var weeklySteps =  [];

           for(let i = 0;i <= 6; i++){
               weeklySteps.push(this.getBucket(i));
           }
           return weeklySteps;
        },
        isloggedIn(){
            if (localStorage.getItem("token") === null) {
                return false;
            }else{
                return true;
            }
        },
        getWeeklyMedMins(){

            var medMins = [];
            var blarg = [];

            for (let i = 0;i <= 6;i++){
                medMins.push(this.getDailyActivity(i,45));
            }

            for (let i = 0;i <=6; i++) {
                blarg.push(medMins[i].reduce((mins, {endTimeMillis, startTimeMillis}) => {
                        mins += Number(endTimeMillis / 60000).toFixed() - Number(startTimeMillis / 60000).toFixed();
                    return mins
                }, 0));
            }

            console.log(blarg);


            console.log(medMins);
            return blarg;
        }
    },
    computed: {
        sundayList: function() {
            return this.getDayList(0);
        },
        mondayList: function(){
            return this.getDayList(1);
        },
        tuesdayList: function(){
            return this.getDayList(2);
        },
        wednesdayList: function(){
            return this.getDayList(3);
        },
        thursdayList: function(){
            return this.getDayList(4);
        },
        fridayList: function(){
            return this.getDayList(5);
        },
        saturdayList: function(){
            return this.getDayList(6)
        },
        sundaySteps: function() {
            return this.getBucket(0);
        },
        mondaySteps: function() {
            return this.getBucket(1);
        },
        tuesdaySteps: function() {
            return this.getBucket(2);
        },
        wednesdaySteps: function(){
            return this.getBucket(3);
        },
        thursdaySteps: function() {
            return this.getBucket(4);
        },
        fridaySteps: function(){
            return this.getBucket(5);
        },
        saturdaySteps: function(){
            return this.getBucket(6);
        },
        weeklySteps: function() {
            return this.getWeeklySteps();
        },
        weeklyMed: function(){
            return this.getWeeklyMedMins();
        }
    },
    created: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                // console.log('Signed in as: ', user);

                app.authUser = new User(user);
                app.loggedIn = true;
            } else {
                // User is signed out.
                // console.log('Not signed in.');

                app.authUser = null;
                app.loggedIn = false;
            }
        });
    },
    watch:{

    }
});