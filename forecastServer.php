<?php
    if(isset($_GET['streetAddress'],$_GET['city'],$_GET['selectState'],$_GET['degree']))
        {
            $address = $_GET['streetAddress'];
            $city = $_GET['city'];
            $state = $_GET['selectState'];
            $degreeUnit = $_GET['degree'];
            //echo 'address is ' . $address . 'city is ' . $city . 'state is ' . $state . 'degree unit ' . $degreeUnit;
            $consoleKey = "AIzaSyCa9rs9pTrRtZGKW5A_06PR3T6Z61A9U7k";
            $apiKey = "11a14e4eb861e4e09a3780ab77dd1e4f";
        
            $formatAddress = str_replace(" ","+",$address);
            $formatCity = str_replace(" ","+",$city);
            $xmlSearchQuery="https://maps.googleapis.com/maps/api/geocode/xml?";
            $xmlSearchQuery .= "address=" . $formatAddress . "," . $formatCity . "," . $state . "&key=" . $consoleKey;
            //echo $xmlSearchQuery;
        
            $xmlDoc = simplexml_load_file($xmlSearchQuery);
        
            $resultStatus = $xmlDoc->status;
            if($resultStatus == 'OK'){
                $latitude = $xmlDoc->result[0]->geometry[0]->location[0]->lat;
                $longitude = $xmlDoc->result[0]->geometry[0]->location[0]->lng;
                //echo "Latitude :: Longitude ::" . $latitude . "::" . $longitude;
                $forecastLink = "https://api.forecast.io/forecast/". $apiKey . "/" . $latitude . "," . $longitude . "?units=" .                                     $degreeUnit . "&exclude=flags";
                //echo $forecastLink;
                
                //This returns data in json file
                $jsonfileHandle = file_get_contents($forecastLink);
                echo $jsonfileHandle;
        }
        else{
            echo "Invalid Address alert!";
        }
    }
?>