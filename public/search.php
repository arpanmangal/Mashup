<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];
    
    // retrive the to be searched keywords from $_GET["geo"]
    // https://stackoverflow.com/a/13225184/7116413
    $split_strings = preg_split('/[\ \n\,]+/', $_GET["geo"]);
    $search_string = "'";
    foreach($split_strings as $find)
    {
        $search_string = $search_string."+".$find."* ";
    }
    $search_string = $search_string."'";
    
    // search database for places matching $_GET["geo"], store in $places
    // query database for user
    $rows = CS50::query("SELECT * FROM places WHERE MATCH (postal_code, admin_name1, place_name) 
                         AGAINST (".$search_string." IN BOOLEAN MODE)");
                         

    // if we found a row
    if (count($rows) > 0)
    {
        // iterate over each row
        foreach ($rows as $row)
        {
            // https://stackoverflow.com/questions/17332163/build-json-array-in-php-dynamically
            // This appends a new element to $places, in this case the value is another array
            $places[] = [
                "id" => $row["id"],
                "country_code" =>  $row["country_code"],
                "postal_code"  =>  $row["postal_code"],
                "place_name"   =>  $row["place_name"],
                "admin_name1"  =>  $row["admin_name1"],
                "admin_code1"  =>  $row["admin_code1"],
                "admin_name2"  =>  $row["admin_name2"],
                "admin_code2"  =>  $row["admin_code2"],
                "admin_name3"  =>  $row["admin_name3"],
                "admin_code3"  =>  $row["admin_code3"],
                "latitude"     =>  $row["latitude"],
                "longitude"    =>  $row["longitude"],
                "accuracy"     =>  $row["accuracy"]
            ];
        }
    }
    
        
    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>