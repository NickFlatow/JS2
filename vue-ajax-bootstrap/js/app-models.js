// creates an array with extra methods for our Book Collections
var BookCollection = function(arr){
    // Load array if provided.
    // Load empty array if one was not provided.
    if(!Array.isArray(arr)){
        arr = [];
    }

    // Methods for using the collection.
    arr.add = function(book){
        return arr.push(book);
    };

    arr.remove = function(book){
        return arr.splice(arr.findBook(book), 1);
    };

    arr.contains = function(book){
        return this.findBook(book) >= 0;
    };

    // Internal function for finding books.
    // Assumes all books have an id.
    arr.findBook = function(book){
        return arr.findIndex(function(item){
            return item.id == book.id;
        });
    };

    // return array with added collection methods
    return arr;
}