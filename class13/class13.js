// JavaScript Document
$(document).ready(function(e) {
    // target the onkeyup of the text box
	$('#search_name').keyup(function(e) {
        // make the request to the server
		$.get(
			'world.php', // file on the server
			{table: "country", name: $(this).val()}, // object of data to pass to the server
			function(data){ // function to call on success
				// data is what is returned from the server
				
				// check if there was a success
				if(data.status == 200){
					// success	
					// create bulleted list
					$('#results').html('<ul></ul>');
					
					// all of our results are in data.results
					for(var i = 0; i < data.results.length; i++){
					//for(result in data.results){	
						if(data.results[i].Name){
							$('#results ul').append(
							'<li>' + data.results[i].Name + ', ' 
							+ data.results[i].Continent + '</li>'
							);
						}
					}
					
				}else{
					// some sort of error
					$('#results').html("ERROR: " + data.message);	
				}
				
				
			},
			'json' // data type returned from the server
		);
		
    });
	
	$('#search_form').submit(function(e) {
        return false;
    });
	
	
});