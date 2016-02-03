
function get_preci(p_preci,p_unit)
{
	if(p_unit=="si")
		p_preci=p_preci*0.03937;
	if(p_preci>=0 && p_preci<0.002)
		p_preci_dis="None";
	else if(p_preci>=0.002 && p_preci<0.017)
		p_preci_dis="Very Light";
	else if(p_preci>=0.017 && p_preci<0.1)
		p_preci_dis="Light";
	else if(p_preci>=0.1 && p_preci<0.4)
		p_preci_dis="Moderate";
	else if(p_preci>=0.4)
		p_preci_dis="Heavy";
	
	return p_preci_dis; 
		
}

/*function convert_date(time)
{
	var date = new Date(time*1000);
    // Hours part from the timestamp
    var hours = date.getHours();
	h = h<10?"0"+h:h;
    // Minutes part from the timestamp
	var m = date.getMinutes();
	m = m<10?"0"+m:m;
	var dd = "AM";
    var h = hours;
    if (h >= 12) {
        h = hours-12;
        dd = "PM";
    }
	h = h<10?"0"+h:h;
	var op =h+':'+m+' '+dd;
	return op;
}*/

function convertTimeZone1(time, zone) {
	var date = new Date(time*1000);
    var format = 'h:mm A';
    return moment.tz(date,zone).format(format);
}

function get_image(p_icon)
{
	
	 if(p_icon=="clear-day")
		{p_image="clear.png";img_tip="Clear Day";}
	 else if(p_icon=="clear-night")
		{p_image="clear_night.png";img_tip="Clear Night";}
	 else if(p_icon=="rain")
		{p_image="rain.png";img_tip="Rain";}
	 else if(p_icon=="snow")
		{p_image="snow.png";img_tip="Snow";}
	 else if(p_icon=="sleet")
		{p_image="sleet.png";img_tip="Sleet";}
	 else if(p_icon=="wind")
		{p_image="wind.png";img_tip="Wind";}
	 else if(p_icon=="fog") 
		{p_image="fog.png";img_tip="Fog";}
	 else if(p_icon=="cloudy")
		{p_image="cloudy.png";img_tip="Cloudy";}
	 else if(p_icon=="partly-cloudy-day")
		{p_image="cloud_day.png";img_tip="Cloudy Day";}
	 else if(p_icon=="partly-cloudy-night")
		{p_image="cloud_night.png";img_tip="Cloudy night";}
	var r_concate="<image class='img-responsive' id='current_image' src='images/"+p_image+"' title='"+img_tip+"' alt='"+img_tip+"' />";
	return r_concate;	
	
}


function clear_field(){

document.f1.street.value="";
document.f1.city.value="";
var ele = document.getElementsByName("unit");
//for(var i=0;i<ele.length;i++)
ele[0].checked = true;
document.getElementById("state").selectedIndex = "0";
//document.getElementById("form1").submit();
document.getElementById("street-error").value="";
}	

jQuery("#reset").click(function() {
jQuery("#ip_main").validate.resetForm();
});

jQuery.validator.addMethod( 
  "selectNone", 
 function(value, element) { 
	if (element.value == "") 
	{ 
	return false; 
	} 
	else return true; 
	}, 
	"Please select an option." 
	);
	
jQuery.validator.addMethod( 
  "spaceNone", 
 function(value, element) { 
	if (element.value.trim() == "") 
	{ 
	return false;
	} 
	else return true; 
	}, 
	"" 
	);
	
	var x_validate = '';

$().ready(function(){
	x_validate = $("#ip_main").validate({
		rules: {
			street: {required: true,
					spaceNone: true
					},
			city: {required: true,
					spaceNone: true
					},
			state: { 
					selectNone: true 
					} 
		},
		messages: {
			street: "Please enter the street address",
			city: "Please enter the city name",
			state: "Please select a state"
			
		},
		

		submitHandler: function(form) {
			var p_street=$("#street").val();
			var p_city=$("#city").val();
			var p_state=$("#state").val();
			var p_degree=$("#degree").val();
			$.ajax({  
			type: 'GET',  
			url: 'test.php',
			dataType: 'json',
			data:{ text1: p_street, text2: p_city, text3: p_state, text4: p_degree},
			success: function(response)
			{
				p_unit=document.f1.unit.value;

				//Tab 1 Content Display
				var p_json=jQuery.parseJSON(response);
				var p_summary=p_json.currently.summary;
				
				var p_temper=parseInt(p_json.currently.temperature);
				var p_icon=p_json.currently.icon;
				var p_preci=p_json.currently.precipIntensity;
				var p_rain=100*(p_json.currently.precipProbability);
				var p_windspeed=parseInt(p_json.currently.windSpeed);
			
				var p_dewp=parseInt(p_json.currently.dewPoint);
				var p_humid=100*(p_json.currently.humidity);
				var p_visi=parseInt(p_json.currently.visibility);
				
				var p_sunrise=p_json.daily.data[0].sunriseTime;
				var p_sunset=p_json.daily.data[0].sunsetTime;
				var p_time=p_json.timezone;
								
				var d_tab1_image=get_image(p_icon);
				var d_tab1_temp='<span>'+p_summary+' in '+p_city+', '+p_state+'</span><br /><span>'+p_temper+'</span>';
				
				
				var d_tab1='<table class="table table-striped">';
				d_tab1=d_tab1+'<tr><td>Precipitation</td><td>'+get_preci(p_preci,p_unit)+'</td></tr>';
				d_tab1=d_tab1+'<tr><td>Chance of Rain</td><td>'+p_rain+'</td></tr>';
				d_tab1=d_tab1+'<tr><td>Wind Speed</td><td>'+p_windspeed+' mph</td></tr>';
				d_tab1=d_tab1+'<tr><td>Dew Point</td><td>'+p_dewp+'&deg; F</td></tr>';
				
											
				d_tab1=d_tab1+'<tr><td>Humidity</td><td>'+p_humid+'%</td></tr>';
				d_tab1=d_tab1+'<tr><td>Visibility</td><td>'+p_visi+' mi</td></tr>';
				d_tab1=d_tab1+'<tr><td>Sunrise</td><td>'+convertTimeZone1(p_sunrise,p_time)+'</td></tr>';
				d_tab1=d_tab1+'<tr><td>Sunset</td><td>'+convertTimeZone1(p_sunset,p_time)+'</td></tr></table>';
							

						
			   
			   
				$('#d_image').html(d_tab1_image);
				$('#d_temp_fb').html(d_tab1_temp);
				$('#d_current').html(d_tab1);
				$("#tabs").css("visibility", "visible");
			}
			});
		}
	});
	
	



});

	function clear_form(){
		//alert("test");
	x_validate.resetForm();
	$("#tabs").css("visibility", "hidden");
	}



/*jQuery("#reset").click(function() {
$("#ip_main").resetForm();
});*/





