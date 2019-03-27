var Session = function(arr) {
    // Load array if provided.
    // Load empty array if one was not provided.
    if (!Array.isArray(arr)) {
        arr = [];
    }

    return arr;
}