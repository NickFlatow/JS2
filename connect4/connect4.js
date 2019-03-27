(function() {
//global variables
    var board;
    var player1 = 'player1';
    var player2 = 'player2';
    var currentPlayer = player1;

    var drop = function () {
        //find which column they click on
        var col = $(this).attr('col');

        // check for open spot
        for (var row = board.length - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                //its open
                board[row][col] = currentPlayer;

                // $('#board table tbody tr:eq(' + row + ') td:eq(' + col + ')').html(currentPlayer);
                $('#board table tbody tr:eq(' + row + ') td:eq(' + col + ')').addClass(currentPlayer);

                //exit loop
                break;
            }
        }
        if (row === 0) {
            $(this).prop('disabled', 'disabled');
        }
        check4Win();
        changePlayer();
    }

    function check4Win() {
        //check for vertical win
        for (let row = board.length - 1; row >= 3; row--) {
            for (let col = 0; col < board[row].length; col++) {
                // alert("the thing " + board[row][col]);
                if (board[row][col] === currentPlayer &&
                    board[row - 1][col] === currentPlayer &&
                    board[row - 2][col] === currentPlayer &&
                    board[row - 3][col] === currentPlayer) {
                    //player won
                    endGame();
                }
            }
        }
        //check for horizontal win
        for(let row = board.length -1; row >= 0;row--){
            for(let col = 0; col < board[row].length - 3; col++){
                if (board[row][col] === currentPlayer &&
                    board[row][col + 1] === currentPlayer &&
                    board[row][col + 2] === currentPlayer &&
                    board[row][col + 3] === currentPlayer) {
                    //player won
                    endGame();
                }
            }
        }
        //check for downward diagonal
        for(let row = board.length - 1; row >= 0;row--){
            for(let col = 0; col < board[row].length - 3; col++){
                if (board[row][col] === currentPlayer &&
                    board[row - 1][col + 1] === currentPlayer &&
                    board[row - 2][col + 2] === currentPlayer &&
                    board[row - 3][col + 3] === currentPlayer) {
                    //player won
                    endGame();
                }
            }
        }
        //
        //check for upward diagonal
        for(let row = board.length - 1; row >= 3;row--){
            for(let col = 0; col < board[row].length - 3; col++){
                if (board[row][col] === currentPlayer &&
                    board[row - 1][col - 1] === currentPlayer &&
                    board[row - 2][col - 2] === currentPlayer &&
                    board[row - 3][col - 3] === currentPlayer) {
                    //player won
                    endGame();
                }
            }
        }
    }

    function endGame() {
        $('#winner').html(currentPlayer + 'Wins!');

        //disable button
        $('.dropBtn').prop('disabled', 'disabled');
    }

    function changePlayer() {
        // result = condition                    ? true value : false value;
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function newGame() {
        //array to hold game board
        board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        //table for user to play
        var table = '<table>';


        table += '<thead><tr>';
        for (let col = 0; col < board[0].length; col++) {
            table += '<td><button class ="dropBtn" col = "' + col + '">&darr;</button></td>';
        }
        table += '</thead></tr>'

        //output body of table
        for (let row = 0; row < board.length; row++) {
            table += '<tbody><tr>';
            for (let col = 0; col < board[row].length; col++) {
                table += '<td></td>';
            }
            table += '</tr></tbody>';
        }
        table += '</table>';
        $('#board').html(table);

        //add event handler for buttons
        $('.dropBtn').on('click', drop);
    }

    $(document).ready(function () {
        //start new game
        newGame();
    });
})();