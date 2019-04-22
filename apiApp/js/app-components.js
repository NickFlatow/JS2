
Vue.component('day', {
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
    data: function() {
      return {
          sunday: 'rgba(255, 99, 132, 1)',
          monday: 'rgba(255, 99, 132, 1)',
          tuesday: 'rgba(255, 99, 132, 1)',
          wednesday: 'rgba(255, 99, 132, 1)',
          thursday: 'rgba(255, 99, 132, 1)',
          friday: 'rgba(255, 99, 132, 1)',
          saturday: 'rgba(255, 99, 132, 1)',
      }
    },
    props: {
        weeklysteps: {
            type: Array,
            required: true
        },
        goals: {
            type: Object,
            required: true
        },
    },
    methods: {
      render(){
          this.renderChart({
                  labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  datasets: [
                      {
                          type: 'line',
                          fill: false,
                          borderColor: '#4BF832',
                          borderDash: [5,5],
                          label:'Goal',
                          backgroundColor: '#0d17f8',
                          data: this.goals.steps,
                      },
                      {
                          type: 'bar',
                          label: 'Steps',
                          // backgroundColor: '#3985C3',
                          data: this.weeklysteps,
                          backgroundColor: [
                              this.sunday,
                              this.monday,
                              this.tuesday,
                              this.wednesday,
                              this.thursday,
                              this.friday,
                              this.saturday,
                          ]
                      }

                  ],


              },
              //options
              {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      yAxes: [{
                          display: true,
                          scaleLabel: {
                              display: true,
                              labelString: 'Steps'
                          },
                          ticks: {
                              beginAtZero: true
                          }
                      }]
                  },
                  tooltips: {
                      mode: 'index'
                  },
                  spanGaps: true
              }
              //this.renderChart
          )
      },
      changeColors(){
          for(let i = 0; i < 7;i++){
              let steps = this.weeklysteps[i];

              switch (steps){
                  case steps >= this.goals.steps[0]:
                      //get day of week method
                      break;


              }
          }
      }
    },
    mounted () {
        this.render();
    },
    watch: {
        goals: {
            handler: function (val) {
                console.log("val",val)
                this.color1 = 'rgba(255, 99, 132, 1)';
                console.log(this.color1);
                // this.$data._chart.update();
                this.$data._chart.destroy();
                this.render();
            },
            deep: true
        },
        weeklysteps: {
            handler: function() {
                this.changeColors();
                this.$data._chart.update();
            },
            deep: true
        }
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
        }
    },
    mounted () {
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
                    // type: 'line',
                    // steppedLine: 'beginning',
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
        '<div>\n' +
        ' <b-button v-b-modal.modal variant="outline-light">Set Goals</b-button>\n' +
        '                <!-- Modal Component -->' +
            '<b-modal id="modal" title="Set Your Daily Goals">\n' +
                '<div class= "parent">'+
                    '<div class = "steps stepsbg">'+
                    '        <h5><b>Steps</b></h5>'+
                    '        Sunday:<input type="text" v-model="goals.steps[0]">\n' +
                    '        Monday:<input type="text" v-model="goals.steps[1]">\n' +
                    '        Tuesday:<input type="text" v-model="goals.steps[2]">\n' +
                    '        Wednesday:<input type="text" v-model="goals.steps[3]">\n' +
                    '        Thursday:<input type="text" v-model="goals.steps[4]">\n' +
                    '        Friday:<input type="text" v-model="goals.steps[5]">\n' +
                    '        Saturday:<input type="text" v-model="goals.steps[6]">\n' +
                    '</div>'+
                    '<div class ="med medbg">'+
                    '         <h5><b>Meditation minutes</b></h5>          '+
                    '         Sunday:<input type="text" v-model="goals.meditations[0]">\n' +
                    '         Monday:<input type="text" v-model="goals.meditations[1]">\n' +
                    '         Tuesday:<input type="text" v-model="goals.meditations[2]">\n' +
                    '         Wednesday:<input type="text" v-model="goals.meditations[3]">\n' +
                    '         Thursday:<input type="text" v-model="goals.meditations[4]">\n' +
                    '         Friday:<input type="text" v-model="goals.meditations[5]">\n' +
                    '         Saturday:<input type="text" v-model="goals.meditations[6]">\n' +
                    '</div>'+
                '</div>'+
            '</b-modal>\n' +
        '</div>',
    computed: {

    }

});

Vue.component('day',{
    extends: VueChartJs.Doughnut,
    data: function() {
       return {
          todaysGoal: this.goals.steps[0],
          color1: 'rgba(255, 99, 132, 1)'
       }
    },
    props: {
        weeklysteps:{
            type :Array,
            required:true
        },
        goals:{
            type : Object,
            required:true
        },
    },
    methods: {
      render(){
          this.renderChart({
                  labels: ['Steps','Goals'],
                  datasets: [
                      {
                          label: 'Steps',
                          // backgroundColor: '#3985C3',
                          // borderColor: '#4BF832',
                          data: [this.weeklysteps[0],this.todaysGoal],
                          backgroundColor: [
                              this.color1,
                              'rgba(54, 162, 235, 1)',
                          ]
                      }
                  ],
              },
              //options
              {responsive: true, maintainAspectRatio: false }
              //this.renderChart
          )
      }
    },
    mounted () {
       this.render();
    },
    watch: {
        goals: {
            handler: function () {

                if(this.todaysGoal - this.weeklysteps[0] < 0) {
                    this.todaysGoal = 0;
                    this.color1 = 'rgba(63, 195, 128, 1)';
                }else{
                    this.todaysGoal -= this.weeklysteps[0];
                }
                console.log(this.todaysGoal);
                // this.$data._chart.update();
                this.$data._chart.destroy();
                this.render();
            },
            deep: true
        },
        weeklysteps: {
            handler: function() {

                this.$data._chart.update();
                // console.log(this.weeklysteps[0]);
            },
            deep:true
        }
    }

});
