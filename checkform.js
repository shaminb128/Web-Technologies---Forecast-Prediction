jQuery.validator.addMethod(
	"Noselect",
	function(value, element) {
		if(element.value=="")
			return false;
		else return true;
	},
	"Please select a state"
);

jQuery.validator.addMethod(
	"Nospace",
	function(value, element) {
		if(element.value.trim()=="")
			return false;
		else return true;
	},
	""
);

function get_Icon(icon)
{
	if(icon=="clear-day")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/clear.png";
	else if(icon=="clear-night")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/clear_night.png";
	else if(icon=="rain")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/rain.png";
	else if(icon=="snow")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/snow.png";
	else if(icon=="sleet")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/sleet.png";
	else if(icon=="wind")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/wind.png";
	else if(icon=="fog")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/fog.png";
	else if(icon=="cloudy")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/cloudy.png";
	else if(icon=="partly-cloudy-day")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/cloud_day.png";
	else if(icon=="partly-cloudy-night")
		return "http://cs-server.usc.edu:45678/hw/hw8/images/cloud_night.png";
}

function get_Unit(formdegree)
{
	if(formdegree=="us")
		return "&#8457"
	else 
		return "&#8451";
}

function get_Precipitation(precipitation,formdegree)
{
	if(formdegree=="us")
	{
		if(precipitation>=0&&precipitation<0.002)
			return "None";
		else if(precipitation>=0.002&&precipitation<0.017)
			return "Very Light";
		else if(precipitation>=0.017&&precipitation<0.1)
			return "Light";
		else if(precipitation>=0.1&&precipitation<0.4)
			return "Moderate";
		else if(precipitation>=0.4)
			return "Heavy";
	}
	else
	{
		if(precipitation>=0&&precipitation<0.0508)
			return "None";
		else if(precipitation>=0.0508&&precipitation<0.4318)
			return "Very Light";
		else if(precipitation>=0.4318&&precipitation<2.54)
			return "Light";
		else if(precipitation>=2.54&&precipitation<10.16)
			return "Moderate";
		else if($precipitation>=10.16)
			return "Heavy";
	}
}

function get_Time(time,timezone)
{
	var format = 'h:mm A';
	return moment.unix(time).tz(timezone).format(format);
}

function get_windspeed_Unit(formdegree)
{
	if(formdegree=="us")
		return "mph";
	else
		return "m/s";
}

function get_visibility_Unit(formdegree)
{
	if(formdegree=="us")
		return "mi";
	else
		return "km";
}

function get_pressure_Unit(formdegree)
{
	if(formdegree=="us")
		return "mb";
	else
		return "hPa";
}

function get_Day(time,timezone)
{
	var format = 'dddd';
	var day = moment.unix(time).tz(timezone).format(format);
	return day;
}

function get_MonthDate(time,timezone)
{
	var format1 = 'MMM';
	var format2 = 'DD';
	var month = moment.unix(time).tz(timezone).format(format1);
	var dmonth = moment.unix(time).tz(timezone).format(format2);
	var finalans = month+' '+dmonth;
	return finalans;
}

function check(x)
{
	if(x==""||x==null||typeof x === "undefined")
		return false;
	else
		return true;
}

function fblogin(fbimage, desc, cap, sum)
{
	FB.ui(
	{
		method: 'share',
		href: 'http://forecast.io/',
		picture: fbimage,
		title: desc,
		caption: cap,
		description: sum,
		message: 'Hi'
	},
	function(response) {
		if(response&&!response.error_message) {
			alert('Posted successfully');
		}
		else {
			alert('Not Posted');
		}
	}
	)
}

function create_Map(latitude, longitude)
{
	var lonlat= new OpenLayers.LonLat(longitude,latitude);
					var map = new OpenLayers.Map("basicMap");
					var mapnik = new OpenLayers.Layer.OSM();
					var layer_cloud = new OpenLayers.Layer.XYZ(
						"clouds",
						"http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
							{
								isBaseLayer: false,
								opacity: 0.7,
								sphericalMercator: true
							}
					);
					
					var layer_precipitation = new OpenLayers.Layer.XYZ(
						"precipitation",
						"http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
							{
								isBaseLayer: false,
								opacity: 0.7,
								sphericalMercator: true
							}
					);
					
					map.addLayers([mapnik, layer_precipitation, layer_cloud]);
					
					var fromProjection = new OpenLayers.Projection("EPSG:4326");
					var toProjection   = new OpenLayers.Projection("EPSG:900913");
					var position       = new OpenLayers.LonLat(longitude,latitude).transform( fromProjection, toProjection);
					var zoom           = 9; 
					map.setCenter(position, zoom );
					
					
}


function clearform()
{
	document.getElementById("main").innerHTML='';
}
//jQuery("#reset").click(function() {
	//alert("hi");
	//uery("#formcss").validate.resetForm();
	//document.getElementById("try").innerHTML='';
//});



var mainform = '';

$().ready(function() {
	mainform = $("#myForm").validate({
		rules: {
			street: {required: true, 
						Nospace: true},
			city: {required: true, 
						Nospace: true},
			state: {Noselect: true}
		},
		messages: {
			street: "Please enter street address",
			city: "Please enter the city",
			state: "Please select a state"
		},
		submitHandler: function(form) {
			var formstreet=$("#street").val();
			var formcity=$("#city").val();
			var formstate=$("#state").val();
			var formdegree=$("#degree").val();
			console.log($("#myForm").serializeArray());
			$.ajax({
				type: 'GET',
				url: 'send.php',
				dataType: 'json',
				//data:{ f1: formstreet, f2: formcity, f3: formstate, f4: formdegree},
				data:$("#myForm").serializeArray(),
				success: function(response)
				{	
					//console.log(response);
					var obj = jQuery.parseJSON(response);
					var summary = obj.currently.summary;
					var precipitation = obj.currently.precipIntensity;
					var chance_of_rain = obj.currently.precipProbability;
					var wind_speed = obj.currently.windSpeed;
					var dew_point = obj.currently.dewPoint;
					var humidity = obj.currently.humidity;
					var visibility = obj.currently.visibility;
					var icon = obj.currently.icon;
					var temperature = obj.currently.temperature;
					var lowtemperature = obj.daily.data[0].temperatureMin;
					var hightemperature = obj.daily.data[0].temperatureMax;
					var sunrise = obj.daily.data[0].sunriseTime;
					var sunset = obj.daily.data[0].sunsetTime;
					var timezone = obj.timezone;
					var latitude = obj.latitude;
					var longitude = obj.longitude;
					var formdegree1 = document.myForm.degree.value;
					formdegree = formdegree1;
					//console.log(latitude);
					
					var fbimage = get_Icon(icon);
					var desc = 'Current Weather in '+formcity+', '+formstate;
					var cap = 'WEATHER INFORMATION FROM FORECAST.IO';
					var sum = summary+', '+parseInt(temperature)+get_Unit(formdegree);
					
					var a = '<div id="outputdisplay" class="try"><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#rightnow" aria-controls="rightnow" role="tab" data-toggle="tab">Right Now</a></li><li role="presentation"><a href="#nexthours" aria-controls="nexthours" role="tab" data-toggle="tab">Next 24 Hours</a></li><li role="presentation"><a href="#nextdays" aria-controls="nextdays" role="tab" data-toggle="tab">Next 7 Days</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane active" id="rightnow"><div class="col-lg-6 col-md-6 col-sm-6" id="rightnow1" style="padding: 0px"></div><div class="col-lg-6 col-md-6 col-sm-6" id="basicMap" style="padding: 0px"></div></div><div role="tabpanel" class="tab-pane" id="nexthours"></div><div role="tabpanel" class="tab-pane" id="nextdays" style="height: 450px;"></div>	</div></div>';
					$('#main').html(a);
					var tab1 = '<div class="col-lg-6 col-md-6 col-sm-6" style="background-color: #F27E7F; height: 150px; text-align: center;"><image class="img-responsive" width="140px" height="140px" style="display: block; margin: auto; padding-top: 5px" src="'+get_Icon(icon)+'" alt="'+summary+'" title="'+summary+'"></div>';
					tab1 = tab1+'<div class="col-lg-6 col-md-6 col-sm-6" style="background-color: #F27E7F; height: 150px; text-align: center"><span style="color: white; font-size: 15px; font-weight: bold">'+summary+' in '+formcity+','+formstate+'</span><br>';
					tab1 = tab1+'<span style="color: white; font-size: 60px"><b>'+parseInt(temperature)+'</b></span><span style="color: white; font-size: 20px; position: absolute; margin-top: 12px">'+get_Unit(formdegree)+'</span><br>';
					tab1 = tab1+'<span style="color: blue; font-size: 15px">L:'+parseInt(lowtemperature)+'</span> | <span style="color: green; font-size: 15px">H:'+parseInt(hightemperature)+'</span><button class="btn btn-primary btn-responsive" onclick="fblogin(\''+fbimage+'\',\''+desc+'\',\''+cap+'\',\''+sum+'\')" style="background-image: url(http://cs-server.usc.edu:45678/hw/hw8/images/fb_icon.png); width: 35px; height: 35px; float: right; padding-bottom: 30px; background-size: 100%; background-size: 38px auto; border: 0;"></button></div>';
					tab1 = tab1+'<table class="table table-striped table-responsive" id="tab1" style="padding: 0px">';
					//tab1 = tab1+'<tr class="info"><td align="center"></td>';
					//tab1 = tab1+'<td align= "center"><span style="color: white; font-size: 15px; font-weight: bold">'+summary+' in '+formcity+','+formstate+'</span><br>';
					//tab1 = tab1+'<span style="color: white; font-size: 60px"><b>'+parseInt(temperature)+'</b></span><span style="color: white; font-size: 20px; position: absolute; margin-top: 12px">'+get_Unit(formdegree)+'</span><br>';
					//tab1 = tab1+'<span style="color: blue; font-size: 15px">L:'+parseInt(lowtemperature)+'</span> | <span style="color: green; font-size: 15px">H:'+parseInt(hightemperature)+'</span><button class="btn btn-primary btn-responsive" onclick="fblogin(\''+fbimage+'\',\''+desc+'\',\''+cap+'\',\''+sum+'\')" style="background-image: url(http://cs-server.usc.edu:45678/hw/hw8/images/fb_icon.png); width: 40px; height: 40px; float: right; background-size: 100%; background-size: 42px auto; border: 0;"></button></td>';
					tab1 = tab1+'<tr class="active"><td>Precipitation</td><td align= "center">'+get_Precipitation(precipitation,formdegree)+'</td></tr>';
					tab1 = tab1+'<tr class="danger"><td>Chance of Rain</td><td align= "center">'+parseInt(chance_of_rain*100)+'%</td></tr>';
					tab1 = tab1+'<tr class="active"><td>Wind Speed</td><td align= "center">'+wind_speed.toFixed(2)+' '+get_windspeed_Unit(formdegree)+'</td></tr>';
					tab1 = tab1+'<tr class="danger"><td>Dew Point</td><td align= "center">'+dew_point.toFixed(2)+' '+get_Unit(formdegree)+'</td></tr>';
					tab1 = tab1+'<tr class="active"><td>Humidity</td><td align= "center">'+parseInt(humidity*100)+'%</td></tr>';
					if (check(visibility))
						tab1 = tab1+'<tr class="danger"><td>Visibility</td><td align= "center">'+visibility.toFixed(2)+' '+get_visibility_Unit(formdegree)+'</td></tr>';
					else
						tab1 = tab1+'<tr class="danger"><td>Visibility</td><td align= "center">NA</td></tr>';
					tab1 = tab1+'<tr class="active"><td>Sunrise</td><td align= "center">'+get_Time(sunrise,timezone)+'</td></tr>';
					tab1 = tab1+'<tr class="danger"><td>Sunset</td><td align= "center">'+get_Time(sunset,timezone)+'</td></tr>';
					tab1 = tab1+'</table>';
					
					
					create_Map(latitude, longitude);
					
					var tab2 = '<table class="table" id="tab2"><tr class="warning"><td align="center">Time</td><td align="center">Summary</td><td align="center">Cloud Cover</td><td align="center">Temp('+get_Unit(formdegree)+')</td><td align="center">View Details</td></tr>';
					tab2 = tab2+'<tr class="active"><td colspan="5"></td></tr>';
					for(var i=1; i<25; i++)
					{
						tab2 = tab2+'<tr class="active">';
						tab2 = tab2+'<td align="center">'+get_Time(obj.hourly.data[i].time,timezone)+'</td>';
						tab2 = tab2+'<td align="center"><image class="img-responsive" width="100px" height="100px" src="'+get_Icon(obj.hourly.data[i].icon)+'" alt="'+obj.hourly.data[i].summary+'" title="'+obj.hourly.data[i].summary+'"></td>';
						tab2 = tab2+'<td align="center">'+parseInt(obj.hourly.data[i].cloudCover*100)+' %</td>';
						tab2 = tab2+'<td align="center">'+obj.hourly.data[i].temperature.toFixed(2)+'</td>';
						tab2 = tab2+'<td align="center"><a class="btn btn-xs" role="button" data-toggle="collapse" href="#disp'+i+'" aria-expanded="false" aria-controls="display"><span class="glyphicon glyphicon-plus"></span></a></td></tr>';
						tab2 = tab2+'<tr style="background-color: black"><td  colspan="5" style="padding: 0px">';
						tab2 = tab2+'<div class="collapse" style="background-color: #D0D0D0; padding: 10px" id="disp'+i+'">';
						tab2 = tab2+'<table class="table table-striped" id="details" border="0">';
						tab2 = tab2+'<tr><td align="center">Wind</td><td align="center">Humidity</td><td align="center">Visibility</td><td align="center">Pressure</td></tr>';
						tab2 = tab2+'<tr style="background-color: #D0D0D0;">';
						tab2 = tab2+'<td align="center">'+obj.hourly.data[i].windSpeed+get_windspeed_Unit(formdegree)+'</td>';
						tab2 = tab2+'<td align="center">'+parseInt(obj.hourly.data[i].humidity*100)+'%</td>';
						if(check(obj.hourly.data[i].visibility))
							tab2 = tab2+'<td align="center">'+obj.hourly.data[i].visibility+get_visibility_Unit(formdegree)+'</td>';
						else
							tab2 = tab2+'<td align="center">NA</td>';
						tab2 = tab2+'<td align="center">'+obj.hourly.data[i].pressure+get_pressure_Unit(formdegree)+'</td></tr>';
						tab2 = tab2+'</table></div></td></tr>';
					}
					tab2 = tab2+'</table>';
					
					var tab3 = '<div class="row" id="change" style="padding-top: 10px; margin: 0px; padding-bottom: 10px">';
					//var tab3 = '';
					//tab3 = tab3+'<div class="col-lg-1 col-lg-offset-2 col-md-1 col-md-offset-2">';
					for(var i=1; i<8; i++)
					{
						if(i==1)
						{
							tab3 = tab3+'<div class="col-lg-1 col-lg-offset-2 col-md-12 col-sm-12" style="padding-left:5px; padding-right:5px; padding-top: 5px; padding-bottom: 5px">';
						}
						else
						{	
						tab3 = tab3+'<div class="col-lg-1 col-md-12 col-sm-12" style="padding-left:5px; padding-right:5px; padding-top: 5px; padding-bottom: 5px">';}
						tab3=tab3+'<button type="button" class="btn btn-primary btn-large col-lg-12 col-md-12 col-sm-12" style="display: block; margin: auto; padding: 0px; width: 100%;" data-toggle="modal" data-target="#modal'+i+'" id="b'+i+'">';
						tab3 = tab3+'<b>'+get_Day(obj.daily.data[i].time,timezone)+'</b><br><br>';
						tab3 = tab3+'<b>'+get_MonthDate(obj.daily.data[i].time,timezone)+'</b><br><br>';
						tab3 = tab3+'<image class="center-block" width="80px" height="80px" src="'+get_Icon(obj.daily.data[i].icon)+'" alt="'+obj.daily.data[i].summary+'" title="'+obj.daily.data[i].summary+'"><br>';
						tab3 = tab3+'Min<br>Temp<br><br><span style="font-size: 30px"><b>'+parseInt(obj.daily.data[i].temperatureMin)+'&#176</b></span><br><br>';
						tab3 = tab3+'Max<br>Temp<br><br><span style="font-size: 30px"><b>'+parseInt(obj.daily.data[i].temperatureMax)+'&#176</b></span>';
						tab3 = tab3+'</button>';
						tab3 = tab3+'<div class="modal fade" id="modal'+i+'" tabindex="-1" role="dialog" aria-labelledby="modal'+i+'">';
						tab3 = tab3+'<div class="modal-dialog" role="document">';
						tab3 = tab3+'<div class="modal-content">';
						tab3 = tab3+'<div class="modal-header">';
						tab3 = tab3+'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
						tab3 = tab3+'<h4 class="modal-title" id="modal'+i+'label"><b>Weather in '+formcity+' on '+get_MonthDate(obj.daily.data[i].time,timezone)+'</b></h4>';
						tab3 = tab3+'</div>';
						tab3 = tab3+'<div class="modal-body" style="float: center; text-align: center">';
						tab3 = tab3+'<span style="float: center"><image class="center-block" width="150px" height="150px" src="'+get_Icon(obj.daily.data[i].icon)+'" alt="'+obj.daily.data[i].summary+'" title="'+obj.daily.data[i].summary+'"></span><br>';
						tab3 = tab3+'<b><span style="margin: 0 auto; font-size: 30px">'+get_Day(obj.daily.data[i].time,timezone)+': <span style="color: #FF9933">'+obj.daily.data[i].summary+'</span></span></b><br>';
						tab3 = tab3+'<div class="row"><div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none; text-align: center;"><b>Sunrise Time</b><br>'+get_Time(obj.daily.data[i].sunriseTime,timezone)+'</div><div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none; text-align: center;"><b>Sunset Time</b><br>'+get_Time(obj.daily.data[i].sunsetTime,timezone)+'</div><div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none; text-align: center;"><b>Humidity</b><br>'+parseInt(obj.daily.data[i].humidity*100)+'%</div><br>';
						tab3 = tab3+'<div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none;  text-align: center;"><b>Wind Speed</b><br>'+obj.daily.data[i].windSpeed+get_windspeed_Unit(formdegree)+'</div><div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none; text-align: center;"><b>Visibility</b><br>';
						if(check(obj.daily.data[i].visibility))
							tab3 = tab3+obj.daily.data[i].visibility+get_visibility_Unit(formdegree)+'</div><div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none; text-align: center;"><b>Pressure</b><br>'+obj.daily.data[i].pressure+get_pressure_Unit(formdegree)+'</div></div></div>';
						else
							tab3 = tab3+'NA</div><div class="col-lg-4 col-md-4 col-sm-4" style="border-top: none; text-align: center;"><b>Pressure</b><br>'+obj.daily.data[i].pressure+get_pressure_Unit(formdegree)+'</div></div></div>';
						tab3 = tab3+'<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';
						tab3 = tab3+'</div>';
					}
					tab3 = tab3+'</div>';
					
					
					$('#rightnow1').html(tab1);
					//$('#rightnowbasic').html(tab11);
					//$('#rightnowbasic1').html(tab12);
					//$('#rightnow2').html(map);
					$('#nexthours').html(tab2);
					$('#nextdays').html(tab3);
					
					//$("#outputdisplay").css("visibility", "visible");
				}
			});
		}
	});
});



