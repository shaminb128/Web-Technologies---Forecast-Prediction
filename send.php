<?php
	if(isset($_GET['street'])&&isset($_GET['city'])&&isset($_GET['state'])&&isset($_GET['degree']))
	{
		$street = $_GET['street'];
		$city = $_GET['city'];
		$state = $_GET['state'];
		
		//echo $units;
		//echo 'address'.$_GET['street'];
		//echo 'city'.$_GET['city'];
		//echo 'state'.$_GET['state'];
		$Address = $street . "," . $city . "," . $state;
		//echo 'add'.$Address;
		$Address = urlencode($Address);
		//echo 'add'.$Address;
		$request_url = "https://maps.googleapis.com/maps/api/geocode/xml?address=".$Address."&key=AIzaSyAFgs0EQucK0q8nYqOhVLB4D2fXCCClM20";
		//echo $request_url;
		$xml = simplexml_load_file($request_url) or die("url not loading");
		
		$status = $xml->status;
		//echo $status;
		if($status=="OK")
		{
			$lat = $xml->result->geometry->location->lat;
			$lon = $xml->result->geometry->location->lng;
			$units = $_GET['degree'];
			//echo 'units'.$units;
			//$latlng = "$lat,$lon";
			//echo 'lat'.$latlng;
			$api_key = 'f528522997d10cc53f360de1662eaba2';
			$url = "https://api.forecast.io/forecast/".$api_key."/".$lat.",".$lon."?units=".$units."&exclude=flags";
			//echo 'hey'.$url;
			$json_url = file_get_contents($url);
			$json = json_encode($json_url, true);
			echo $json;
		}
	}
?>
