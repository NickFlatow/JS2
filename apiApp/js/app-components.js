Vue.component('day', {
    //props: ['items'] or
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
            type: Object
        }
        // steps:{
        //     type: Number,
        //     default: 0
        // }

    },
    methods: {

    },
    template: ''+
        '         <div>'+
        '           <h1>{{name}}</h1>\n' +
        '            <div class = "row">\n' +
        '            </div>' +
        '            <h1>{{(medMins)}}</h1>'+
        '            <h1 v-if="steps.dataset[0].point[0]">{{steps.dataset[0].point[0].value[0].intVal}}</h1>'+
        '            <h1 v-else>0</h1> '+
        // '            <h1>{{steps}}</h1>'+
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