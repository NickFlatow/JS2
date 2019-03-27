<?php

// connect to database: host,  username,  student_id, db name
$dbc = new MySQLi('localhost', 'tkowalch', 'lampdev', 'world');

// empty object to return
$return = new stdClass();
$return->status = 0;
$return->message = '';
$return->results = array();

// convert all keys to lowercase to allow either lowercase or camelcase
$_GET = array_change_key_case($_GET, CASE_LOWER);

// pick query
if(isset($_GET['table'])){
	switch(strtolower($_GET['table'])){
		case 'city':
			// build SELECT statement
			$query = "SELECT * FROM City";

			// build WHERE clause
			if(isset($_GET['name'])){
				$query .= " WHERE Name LIKE '%{$_GET['name']}%'";
			}elseif(isset($_GET['code'])){
				$query .= " WHERE CountryCode LIKE '%{$_GET['code']}%'";
			}elseif(isset($_GET['countrycode'])){
				$query .= " WHERE CountryCode LIKE '%{$_GET['countrycode']}%'";
			}
			
			// build ORDER BY clause
			$query  .= " ORDER BY Name";
			
			break;
		case 'country':
			// build SELECT statement
			$query = "SELECT * FROM Country";

			// build WHERE clause
			if(isset($_GET['name'])){
				$query .= " WHERE Name LIKE '%{$_GET['name']}%'";
			}elseif(isset($_GET['code'])){
				$query .= " WHERE Code LIKE '%{$_GET['code']}%'";
			}elseif(isset($_GET['countrycode'])){
				$query .= " WHERE Code LIKE '%{$_GET['countrycode']}%'";
			}
			
			
			// build ORDER BY clause
			$query  .= " ORDER BY Name";
			
			break;
		case 'countrylanguage':
			// build SELECT statement
			$query = "SELECT * FROM CountryLanguage";

			// build WHERE clause
			if(isset($_GET['language'])){
				$query .= " WHERE Language LIKE '%{$_GET['language']}%'";
			}elseif(isset($_GET['code'])){
				$query .= " WHERE CountryCode LIKE '%{$_GET['code']}%'";
			}elseif(isset($_GET['countrycode'])){
				$query .= " WHERE CountryCode LIKE '%{$_GET['countrycode']}%'";
			}
			
			// build ORDER BY clause
			$query  .= " ORDER BY Language";
			
			break;
		default:
			// return error message
			$return->status = 500;
			$return->message = "Invalid table.";
			echo json_encode($return);
			die();
	}
}else{
	// return error message
	$return->status = 500;
	$return->message = "Invalid table.";
	echo json_encode($return);
	die();
}

// execute query
$result = $dbc->query($query);
if($result){
	// build an array of results
	$results = array();
	while($row = $result->fetch_object()){
		// fix utf8 issues
		foreach($row as &$field){
			$field = utf8_encode($field);
		}
		
		// add row to array
		$results[] = $row;
	}
	
	// return results as JS array of objects
	$return->status = 200;
	$return->results = $results;
	echo json_encode($return);
	die();
}else{
	// return error message
	$return->status = 500;
	$return->message = "Error in query.";
	echo json_encode($return);
	die();
}





?>

