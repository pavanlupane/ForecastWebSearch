function shareFBPost(my_icon,my_city,my_state,my_temper)
        {
                var fb_img='http://cs-server.usc.edu:45678/hw/hw8/images/'+my_icon;
                var fb_title='Current Weather in '+my_city+','+my_state;
                var fb_temp=my_temper;
                FB.ui(
                  {
                    method: 'share',
                    href: 'http://forecast.io/',
                    picture: fb_img,
                    title: fb_title,
                    caption: 'WEATHER INFORATION FROM FORECAST.IO',
                    description: fb_temp,
                    message: 'Facebook Dialogs are easy!'

                  },
              // callback
                  function(response) {
                    if (response && !response.error_message) {
                      alert('Posting Successfully');
                    } else {
                      alert('Not Posted');
                    }
                  }
            );
        }
    function resetVlaues(){
                $('#tabClass').css("visibility","hidden");
                $('#tabClass').css("overflow","hidden");
                    var nullValues=document.getElementById("streetAddress");
                    nullValues.value="";
                    nullValues=document.getElementById("city");
                    nullValues.value="";                    
                    nullValues=document.getElementById("selectState");
                    nullValues.selectedIndex=nullValues.defaultSelected;
                    nullValues=document.getElementById("degree");
                    nullValues.checked=nullValues.defaultChecked;
                    
                    var myAddress = document.getElementById("streetAddress");
                    var myCity = document.getElementById("city");
                    var myState = document.getElementById("selectState");
                    
                    if (myAddress.value == "") {
                        myAddress.style.backgroundColor = "white";
                    }
                    if (myCity.value == "") {
                        myCity.style.backgroundColor = "white";
                    }
                    if (myState.value == "") {
                        myState.style.backgroundColor = "white";
                    }
                document.getElementById("rightNowDiv2").innerHTML = "";
                
                    
                }

$(document).ready(function() {
       $("#myForm").validate({
           rules: {
               streetAddress: "required",
               city: "required",
               selectState: "required"
           },
           messages: {
               streetAddress: "<span style='color:red'>Please enter the street address</span>",
               city: "<span style='color:red'>Please enter the city</span>",
               selectState: "<span style='color:red'>Please select a state</span>"
           },
           submitHandler: function(form) { 
               submitFormAction();
            }
       });
        function submitFormAction(){
            //alert("Form submitted!");
            //console.log( $("#myForm").serialize() );
            var that = $("#myForm"),
                url=that.attr('action'),
                method=that.attr('method'),
                data=that.serializeArray();

            console.log( data );

            $.ajax({
                url: url,
                type: method,
                data: data,
                dataType: 'json',
                success: function(response){
                    
                    document.getElementById("rightNowDiv2").innerHTML = "";
                    //console.log(response['currently']['summary']);
                    rightNowTabContent(response);
                    rightNowTabMap(response);
                    next24HoursContent(response);
                    next7daysContent(response);
                    $('#tabClass').css("visibility","visible");
                    $('#tabClass').css("overflow","visible");
                }
            });
        }
    

    function getUnit(formDegree,unitName){
        var myUnit='';
        if(formDegree == 'us'){ 
            //console.log("I am in US");
            switch(unitName){
                case 'temp': myUnit="°F";
                    break;
                case 'windspeed': myUnit="mph";
                    break;
                case 'visibility': myUnit="mi";
                    break;
                case 'pressure': myUnit="mb";
                    break;
                case 'dew': myUnit="°F";
                    break;
            }
        }else{
            //console.log("I am in IS");
            switch(unitName){
                case 'temp': myUnit="°C";
                    break;
                case 'windspeed': myUnit="m/s";
                    break;
                case 'visibility': myUnit="km";
                    break;
                case 'pressure': myUnit="hPa";
                    break;
                case 'dew': myUnit="°C";
                    break;
            }
        }
       return myUnit;
    }
    function rightNowTabMap(response){
            //Center of map
        var lonlat = new OpenLayers.LonLat(response['latitude'],response['longitude']);

        var map = new OpenLayers.Map("rightNowDiv2");
        
        var mapnik = new OpenLayers.Layer.OSM();
        
        //this is layer 2
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
    
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(response['longitude'],response['latitude']).transform( fromProjection, toProjection);
    var zoom = 9; 

    map.setCenter(position, zoom );
    }
    
    function rightNowTabContent(response){
        var dataArray = buildArray(response);
        console.log(response);
        //printArrayCheck(dataArray);
        var summary = response['currently']['icon'] +' '+parseInt(dataArray['temperature'])+' '+getUnit(document.forms["myForm"]["degree"].value,'temp');
        var tab1String = '';
        tab1String +='<div width="100%" class="col-lg-6 col-md-6 col-sm-6" id="leftHeader" style="padding-top:10px; height:155px; background-color:#FF8383; text-align:center; padding-top:10px;"><img src=\"'+dataArray['iconString']+'\" alt=\"'+dataArray['icon']+'\" title=\"'+dataArray['icon']+'\" height=\"140\" width=\"140\"></div>';
        tab1String +='<div style="background-color:#FF8383; text-align:center; height:155px; padding-top:10px;" class="col-lg-6 col-md-6 col-sm-6" id="rightHeader"><span style="text-align:center; color:white;">'+dataArray['summary']+' in '+ $("#city").val()+','+$("#selectState").val()+'</span>';
        tab1String += '<br><span style="text-align:center; font-size: 60px; color:white;"><b>'+ parseInt(dataArray['temperature']) +'<b><span style="color:white; font-size:15px; position: absolute; margin-top:10px;">'+getUnit(document.forms["myForm"]["degree"].value,'temp')+'</span></span>';
        tab1String += '<br><span style="color:#0000FF;">L:'+ parseInt(dataArray['TemperatureMin']) +'&deg</span>|<span style="color:#009933;">H:'+ parseInt(dataArray['TemperatureMax']) +'&deg</span><button type="button" style="background-image: url(http://cs-server.usc.edu:45678/hw/hw8/images/fb_icon.png); height: 35px; width:35px; float: right; background-size:100%; background-size:38px auto; border:0px;" onclick="shareFBPost(\''+getImageString(dataArray['icon'])+'\',\''+$("#city").val()+'\',\''+$("#selectState").val()+'\',\''+summary+'\')"></button>';
        tab1String +='</div>';
        tab1String +='<table width="100%">';
        tab1String +='<tr><td id="td1">Precipitation</td><td id="td2">'+ dataArray['precipitationText'] + '</td></tr>';
        tab1String +='<tr><td id="td1">Chance of Rain</td><td id="td2">'+ (dataArray['precipProbability'])*100 + '%</td></tr>';
        tab1String +='<tr><td id="td1">Wind Speed</td><td id="td2">'+ dataArray['windSpeed'] + ' '+getUnit(document.forms["myForm"]["degree"].value,'windspeed')+'</td></tr>';
        tab1String +='<tr><td id="td1">Dew Point</td><td id="td2">'+ (dataArray['dewPoint']).toFixed(2) + ' '+getUnit(document.forms["myForm"]["degree"].value,'dew')+'</td></tr>';
        tab1String +='<tr><td id="td1">Humidity</td><td id="td2">'+ (dataArray['humidity'])*100 + '%</td></tr>';
    if(isVisibleDefined(dataArray['visibility'])){
           tab1String +='<tr><td id="td1">Visibility</td><td id="td2">'+ (dataArray['visibility']).toFixed(2) +' '+ getUnit(document.forms["myForm"]["degree"].value,'visibility')+ '</td></tr>';
           }else{
               tab1String +='<tr><td id="td1">Visibility</td><td id="td2">NA</td></tr>';
           }
        tab1String +='<tr><td id="td1">Sunrise</td><td id="td2">'+ getTime(dataArray['sunriseTime'],response['timezone']) + '</td></tr>';
        tab1String +='<tr><td id="td1">Sunset</td><td id="td2">'+ getTime(dataArray['sunsetTime'],response['timezone']) + '</td></tr>';
        tab1String += '</table>';
        
        $('#rightNowDiv1').html(tab1String);
        
    }
    function next24HoursContent(response){
        var tab2String = '';
    for(var i = 0; i < 24; i++){
        tab2String += '<div class="row" style="padding: 0px; padding-top:15px; padding-bottom:15px; margin: 0px; text-align:center; background-color:white; border-bottom-width:1px;border-bottom-color:#E4E4E4;">';
        //console.log('value of i::'+i);
        tab2String += '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">'+getTime(response['hourly']['data'][i].time,response['timezone'])+'</div>';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><img height="50" width="50"  src=\"http://cs-server.usc.edu:45678/hw/hw8/images/'+ getImageString(response['hourly']['data'][i].icon) +'\" alt=\"'+response['hourly']['data'][i].icon+'\" title=\"'+response['hourly']['data'][i].icon+'\"></div>';
        tab2String += '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">'+ ((response['hourly']['data'][i].cloudCover)*100).toFixed(2) +'%</div>';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'+ response['hourly']['data'][i].temperature +' '+getUnit(document.forms["myForm"]["degree"].value,'temp')+'</div>';
        tab2String += '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#collapse'+i+'\" data-toggle="collapse" aria-controls="collapseOne"><span class="glyphicon glyphicon-plus"></span></a></div></div>';
        tab2String += '<div class="panel panel-default" style="margin:0;">';
        tab2String += '<div id="collapse'+i+'\" class="panel-collapse collapse">';
        tab2String += '<div class="panel-body" style="padding-top:30px; background-color:#E4E4E4;">';
        tab2String += '<table id="collapseTable" width="100%"><tr style="background-color:white; text-align:center;"><td style="height:30px;">';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><b>Wind</b></div>';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><b>Humidity</b></div>';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><b>Visibility</b></div>';
        tab2String += '<div class="col-lg-3"><b>Pressure</b></div>';
        tab2String += '</td></tr><tr style="text-align:center;"><td style="height:20px">';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'+response['hourly']['data'][i].windSpeed+' '+ getUnit(document.forms["myForm"]["degree"].value,'windspeed')+'</div>';
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'+((response['hourly']['data'][i].humidity)*100).toFixed(2)+'%</div>';
        if(isVisibleDefined(response['hourly']['data'][i].visibility)){
            tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'+response['hourly']['data'][i].visibility+' '+getUnit(document.forms["myForm"]["degree"].value,'visibility')+'</div>';
        }else{
            tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"> NA </div>';
        }
        tab2String += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'+response['hourly']['data'][i].pressure+' '+getUnit(document.forms["myForm"]["degree"].value,'pressure')+'</div>';
        tab2String += '</td></tr></table>';
        tab2String += '</div></div></div>';
    }
        $('#tab2Id').html(tab2String);
         
        
    }
    function next7daysContent(response){
        var tab3String = '';
        for(var j = 1; j <= 7 ; j++){
            if(j ==1){
        tab3String += '<div class="col-lg-1 col-lg-offset-2 col-md-1 col-md-offset-1 col-sm-12 col-xs-12" style="padding: 10px; min-width:120px;">';
        }else{
            tab3String += '<div class="col-lg-1 col-md-1 col-sm-12 col-xs-12" style="padding: 10px; min-width:120px;">';
        } 
        tab3String +='<button type="button" class="btn btn-large" style="width: 100%; display: block; margin: auto;" data-toggle="modal" data-target="#modal'+j+'" id="b'+j+'">';
        tab3String +='<b style="color:white;">'+getTimeToDay(response['daily']['data'][j].time,response['timezone'])+'</b><br><br>';//this is day
        tab3String +='<b style="color:white;">'+getTimeToDate(response['daily']['data'][j].time,response['timezone'])+'</b><br><br>';//this is month
        tab3String +='<img height="80" width="80"  src=\"http://cs-server.usc.edu:45678/hw/hw8/images/'+ getImageString(response['daily']['data'][j].icon) +'\" alt=\"'+ response['daily']['data'][j].summary +'\" title=\"'+ response['daily']['data'][j].summary +'\"><br>';
        tab3String +='<span style="color:white;">Min</span><br><span style="color:white;">Temp</span><br><br><span style="font-size: 30px; color:white;"><b>'+parseInt(response['daily']['data'][j].temperatureMin)+'&deg</b></span><br><br>';
        tab3String +='<span style="color:white;">Max</span><br><span style="color:white;">Temp</span><br><br><span style="font-size: 30px; color:white;"><b>'+parseInt(response['daily']['data'][j].temperatureMax)+'&deg</b></span></button>';
        tab3String +='<div class="modal fade" id="modal'+j+'" tabindex="-1" role="dialog" aria-labelledby="modal'+j+'">';
        tab3String +='<div role="document" class="modal-dialog">';
        tab3String +='<div class="modal-content">';
        tab3String +='<div class="modal-header">';
        tab3String +='<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        tab3String +='<h4 class="modal-title" id="modal'+j+'label"><b>Weather in '+$("#city").val()+' on '+getTimeToDate(response['daily']['data'][j].time,response['timezone'])+'</b></h4></div>';
        tab3String +='<div class="modal-body" style="float: center; text-align: center">';
        tab3String +='<span style="float: center"><img height="160" width="160"  src=\"http://cs-server.usc.edu:45678/hw/hw8/images/'+ getImageString(response['daily']['data'][j].icon) +'\" alt=\"'+ response['daily']['data'][j].summary +'\" title=\"'+ response['daily']['data'][j].summary +'\"><br>';
        tab3String +='<div class="row"><b><span style="margin: 0 auto; font-size: 30px; padding-top:10px; padding-bottom:10px;">'+getTimeToDay(response['daily']['data'][j].time,response['timezone'])+': <span style="color: #FF9933">'+response['daily']['data'][j].summary+'</span></span></b><br></div>';//this is day
        //modal header row 1
 
        tab3String +='<div class="row"><div width="100%" id="modalDivId" class="col-lg-4 col-md-4 col-sm-4" id="leftTopHeader" style="text-align:center;"><span id="modalSpanId"><b>Sunrise Time</b></span><br><span id="modalSpanId">'+getTime(response['daily']['data'][j].sunriseTime,response['timezone'])+'</span></div><div width="100%" id="modalDivId" class="col-lg-4 col-md-4 col-sm-4" id="middleTopHeader" style="text-align:center;"><span id="modalSpanId"><b>Sunset Time</b></span><br><span id="modalSpanId">'+getTime(response['daily']['data'][j].sunsetTime,response['timezone'])+'</span></div><div width="100%" id="modalDivId" class="col-lg-4 col-md-4 col-sm-4" id="rightTopHeader" style="text-align:center;"><span id="modalSpanId"><b>Humidity</b></span><br><span id="modalSpanId">'+response['daily']['data'][j].humidity+'</span></div><br>';
        //modal row2
        
        tab3String +='<div width="100%" id="modalDivId" class="col-lg-4 col-md-4 col-sm-4" id="leftBottomHeader" style="text-align:center;"><span id="modalSpanId"><b>Wind Speed</b></span><br><span id="modalSpanId">'+response['daily']['data'][j].windSpeed+' '+getUnit(document.forms["myForm"]["degree"].value,'windspeed')+'</span></div><div width="100%" id="modalDivId" class="col-lg-4 col-md-4 col-sm-4" id="middleBottomHeader" style="text-align:center;"><span id="modalSpanId"><b>Visibility</b></span><br>';
        if(isVisibleDefined(response['daily']['data'][j].visibility)){
            tab3String +='<span id="modalSpanId">'+response['daily']['data'][j].visibility+' '+getUnit(document.forms["myForm"]["degree"].value,'visibility')+'</span></div>';
        }else{
            tab3String +='<span id="modalSpanId">NA</span></div>';
        }
        tab3String +='<div width="100%" id="modalDivId" class="col-lg-4 col-md-4 col-sm-4" id="rightBottomHeader" style="text-align:center;"><span id="modalSpanId"><b>Pressure</b></span><br><span id="modalSpanId">'+response['daily']['data'][j].pressure+' '+getUnit(document.forms["myForm"]["degree"].value,'pressure')+'</span></div></div></div>';
        
        tab3String +='<br><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>';
      }
    $('#innernext7days').html(tab3String);    
        
    }
    
    function printArrayCheck(dataArray){
            for(key in dataArray){
                console.log('inside the function :: '+key+' ::' + dataArray[key]);
            }
    }
    function isVisibleDefined(value){
        if(value == ""| typeof value === "undefined"|value == null){
            return false;
        }else
            return true;
    }
    function buildArray(response){
        var imageString = getImageString(response['currently']['icon']);
        var precipitationText = getPrecipText(response['currently']['precipIntensity']);
        
        var dataArray = {"summary": response['currently']['summary'],
                          "icon": response['currently']['icon'],
                          "temperature": response['currently']['temperature'],
                          "precipIntensity": response['currently']['precipIntensity'],
                          "precipitationText": precipitationText,
                          "precipProbability": response['currently']['precipProbability'],
                          "windSpeed": response['currently']['windSpeed'],
                          "dewPoint": response['currently']['dewPoint'],
                          "humidity": response['currently']['humidity'],
                          "visibility": response['currently']['visibility'],
                          "timezone": response['timezone'],
                          "sunriseTime": response['daily']['data'][0].sunriseTime,
                          "sunsetTime": response['daily']['data'][0].sunsetTime,
                          "TemperatureMin": response['daily']['data'][0].temperatureMin,
                          "TemperatureMax": response['daily']['data'][0].temperatureMax,
                          "iconString": 'http://cs-server.usc.edu:45678/hw/hw8/images/'+imageString};
        
                       // printArrayCheck(dataArray);
        return dataArray;
    }
    
    function getTime(time, zone) {
        var format = 'h:mm A';
        return moment.unix(time).tz(zone).format(format);
        }

    function getTimeToDay(time, zone) {
            var date = new Date(time * 1000);
            var format = 'dddd';
            return moment.tz(date, zone).format(format);
        }

    function getTimeToDate(time, zone) {
            var date = new Date(time * 1000);
            var format = 'MMM DD';
            return moment.tz(date, zone).format(format);
        }
    
    function getPrecipText(precipIntensity){
        var precipText = '';
            if(precipIntensity >= 0 && precipIntensity<0.002){
            precipText = "None";
        }else if(precipIntensity >= 0.002 && precipIntensity <0.017){
            precipText = "Very Light";
        }else if(precipIntensity >= 0.017 && precipIntensity <0.1){
            precipText = "Light";
        }else if(precipIntensity >= 0.1 && precipIntensity <0.4){
            precipText = "Moderate";
        }else if(precipIntensity >= 0.4){
            precipText = "Heavy";
        }
        return precipText;
    }
    
    function getImageString(icon){
        var imageString = '';
           switch(icon) {
               case "clear-day" : 
                   imageString = 'clear.png';
                   break;
                case "clear-night" : 
                   imageString = 'clear_night.png';
                   break;
                case "rain" : 
                   imageString = 'rain.png';
                   break;
                case "snow" : 
                   imageString = 'snow.png';
                   break;
                case "sleet" : 
                   imageString = 'sleet.png';
                   break;
                case "wind" : 
                   imageString = 'wind.png';
                   break;
                case "fog" : 
                   imageString = 'fog.png';
                   break;
                case "cloudy" : 
                   imageString = 'cloudy.png';
                   break;
                case "partly-cloudy-day" : 
                   imageString = 'cloud_day.png';
                   break;
                case "partly-cloudy-night" : 
                   imageString = 'cloud_night.png';
                   break;
           }
        
        return imageString;
    }
});
            