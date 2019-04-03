Vue.component('day', {
    //use day for calculate if badges were earned
    //40 mins med per day = yoda
    //activity type 97 = kettle bell
    //activity type running name > 3 = 5k etc.
    props: {
        dayofweek: {
            type: Array,
            required: true
        },
        name:{
            type: String,
            default: 'Blarg'
        },
        steps:{
            type: Number,
            default: 0
        }

    },
    methods: {

    },
    template: ''+
        '         <div>'+
        '           <h1>{{name}}</h1>\n' +
        '            <div class = "row">\n' +
        '            </div>' +
        '            <h1>{{(medMins)}}</h1>'+
        '            <h1>{{steps}}</h1>'+
        '         </div>',
    computed: {
        medMins() {
            return this.dayofweek.reduce((medMins,  {activityType, endTimeMillis, startTimeMillis} ) => {
                if (activityType == 45) {
                    medMins += Number(endTimeMillis/60000).toFixed()-Number(startTimeMillis/60000).toFixed();
                }
                return medMins
            }, 0)
        }
    }
});

Vue.component('steps-chart', {
    extends: VueChartJs.Bar,
    props: {
        weeklysteps: {
            type: Array,
            required: true
            // [17453,9675,18761,4737,10328.6589,0]
        }
    },
    mounted () {
        this.renderChart({
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [
                {
                    label: 'Steps',
                    backgroundColor: '#3985C3',
                    data: this.weeklysteps
                    // data: this.$parent.getWeeklySteps()
                },
                {
                    label:'Goal',
                    backgroundColor: '#0d17f8',
                    data: [5000,5000,5000,5000,5000,5000,5000]
                }

            ]
        }, {responsive: true, maintainAspectRatio: false})
    }

});

Vue.component('med-chart', {
    extends: VueChartJs.Bar,
    props: {
        weeklymed:{
            type :Array,
            required:true
        },

        goals:{
            type : Object,
            required:true
        },
    },
    mounted () {
        console.log('mounted')
        this.renderChart({
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [
                {
                    label: 'Meditation(minutes)',
                    backgroundColor: '#e7823e',
                    data: this.weeklymed
                    // data: this.$parent.getWeeklyMedMins()
                },
                {
                    label:'Goal',
                    backgroundColor: '#0d17f8',
                    data: this.goals.meditations
                }

            ]
        }, {responsive: true, maintainAspectRatio: false})
    },

    watch: {
        goals: {
            handler: function (val, oldVal) {
                this.$data._chart.update();
            },
            deep: true
        },
    }

});

Vue.component('goals-modal',{
    props: {
        goals:{
            type: Object,
            required: true
        }
    },
    methods: {
    },
    template: ''+
       '    <div>\n' +
        '                <b-button v-b-modal.modal-1>Set Goals</b-button>\n' +
        '                <!-- Modal Component -->' +
        '                <b-modal id="modal-1" title="BootstrapVue">\n' +
        '                    Monday:<input type="text" v-model="goals.steps[1]">\n' +
        '                    Monday:<input type="text" v-model="goals.steps[2]">\n' +
        '                </b-modal>\n' +
        '            </div>',
    computed: {

    }

});