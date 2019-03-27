// create a new angular "app" with any "plugins" you may need
var app = angular.module('todoApp',['ngStorage']);

// add a controller - used to add/respond to BEHAVIORS
// BUSINESS LOGIC ONLY - (no presentation logic)
// (don't manipulate teh DOM/HTML)
app.controller('todoCtrl', function($scope, $localStorage){
    //think of $scope as our model
    //$scope holds the data that will be passed between controller and view

    // array of todos (like model properties)
    // $scope.todos = [
    //     {text: "Eat breakfast", done:true},
    //     {text: "Learn AngularJS", done:false},
    //     {text: "Do Homework", done:false}
    // ];

    $scope.$storage = $localStorage.$default(
        {todos: [
                {text: "Eat breakfast", done: true},
                {text: "Learn AngularJS", done: false},
                {text: "Do Homework", done: false}
            ]
        }
    );

   //custom filter - return a filtered array
   $scope.getCompleteTodos = function(){
       return $scope.$storage.todos.filter(function(todo){
           // return true if it should be included in the results
           return todo.done;
       });
   };

   //custom filter - return a filtered array
   $scope.getInCompleteTodos = function(){
       return $scope.$storage.todos.filter(function(todo){
           // return true if it should be included in the results
           return !todo.done;
       });
   };

   // method to hand adding a todo
    $scope.addTodo = function(){
      //get value from textbox
      // $scope.newTodo has teh value from the textbox
      $scope.$storage.todos.push({ text: $scope.newTodo, done: false});

      // empty the text box by clearing the model value
      $scope.$storage.newTodo='';
    };

    $scope.clearCompleted = function(){
      $scope.$storage.todos = $scope.getInCompleteTodos();
    };


});

