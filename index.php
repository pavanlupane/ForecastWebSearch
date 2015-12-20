<?php
    include "forecastServer.php";
?>
<html>
        <head>
            <meta charset="utf-8">
            <title>Forecast Search</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
            <!--script src="http://code.jquery.com/jquery-2.1.1.min.js"></script-->
            <script src="//ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js"></script>
            <script src="http://openlayers.org/api/OpenLayers.js"></script>
            <script src="moment.js"></script>
            <script src="moment-timezone.js"></script>
            <script src="moment-timezone-with-data.js"></script>
            <script src="validation.js"></script>
            
            <style>
                body{
                    background: url(http://cs-server.usc.edu:45678/hw/hw8/images/bg.jpg);
                    background-size: cover;
                }
                fieldset{
                    background-color:rgba(0,0,0,0.3);
                    color:white;
                }
                sup {
                    color:red;
                }
                
                .glyphicon-refresh:before {
                    margin-right: 10px;
                    
                }
                
                .nav-tabs>li>a {
                    background-color:white;
                }
                .nav-tabs>li.active>a, .nav-tabs>li.active>a:focus{
                      color: white;
                      background-color: #1877B6;
                      border-color: white;
                    }
                #rightNowDiv1 th{
                    background-color: #FF8383;
                    color: white;
                }
               #rightNowDiv1 tr:nth-child(even) {
                    background-color: white;
                }
                #rightNowDiv1 tr:nth-child(odd) {
                    background-color: #FFD8D8;
                }
                #next24hoursTable td{
                    background-color: #1877B6;
                    color: white;
                    text-align: center;
                }
                #td1{
                    height: 35px;
                    padding-left: 5px;
                }
                #td2{
                    height: 35px;
                    padding-left: 5px;
                    text-align: center;
                }
                div.olMap{
                    height: 420px;
                }
                #modalDivId {
                    padding-bottom: 5px;
                    padding-top: 5px;
                }
                #modalSpanId{
                    padding-bottom: 5px;
                    padding-top: 5px;
                }
                #b1{
                    background-color: #2867A8;
                    border: none;
                }
                #b2{
                    background-color: #E72A30;
                    border: none;
                }
                #b3{
                    background-color: #E07B38;
                    border: none;
                }
                #b4{
                    background-color: #979723;
                    border: none;
                }
                #b5{
                    background-color: #855898;
                    border: none;
                }
                #b6{
                    background-color: #F06469;
                    border: none;
                }
                #b7{
                    background-color: #C32B5D;
                    border: none;
                }
                div.olMap{
                    height: 435px;
                }
                .tabClass{
                    visibility: hidden;
                    overflow: hidden;
                }
            </style>
        </head>
        <body>
            <script>
                  window.fbAsyncInit = function() {
                    FB.init({
                      appId      : '419237711618569',
                      xfbml      : true,
                      version    : 'v2.5'
                    });
                  };

                  (function(d, s, id){
                     var js, fjs = d.getElementsByTagName(s)[0];
                     if (d.getElementById(id)) {return;}
                     js = d.createElement(s); js.id = id;
                     js.src = "//connect.facebook.net/en_US/sdk.js";
                     fjs.parentNode.insertBefore(js, fjs);
                   }(document, 'script', 'facebook-jssdk'));
            </script>
            <div id="err"></div>
            <center>
                <h3>Forecast Search</h3>
            </center>
            <div class="container" style="padding: 0px;">
               <fieldset>
               <br />
                <form method="GET" action="forecastServer.php" id="myForm" role="form" class="myFormClass">
                      <div class="form-group">
                         <div class="col-lg-3 col-md-3 col-sm-12" style="padding-right:5px; padding-left:10px;">
                              <label for="address" class="control-label">Street Address:<sup>*</sup></label>
                              <input type="text" class="form-control" value="" id="streetAddress" name="streetAddress" placeholder="Enter street address" style="width:100%" autofocus>
                         </div>
                        <div class="col-lg-2 col-md-2 col-sm-12" style="padding-right:5px; padding-left:5px;">
                             <label for="city" class="control-label">City:<sup>*</sup></label>
                              <input type="text" class="form-control" value="" id="city" name="city"  style="width:100%" placeholder="Enter the city name">
                        </div>
                         <div class="col-lg-2 col-md-2 col-sm-12" style="padding-right:5px; padding-left:5px;">
                             <label for="state" class="control-label">State:<sup>*</sup></label>
                              <select id="selectState" name="selectState" class="form-control" style="width:100%">
                                    <option value="" selected>Select your state...</option>
                              </select>
                         </div>
                         <div class="col-lg-5 col-md-5 col-sm-12" style="padding-top:10px;">
                             <div class="col-lg-6 col-md-6 col-sm-12" style="padding:0px;">
                                  <div class="form-inline">
                                      <div class="short-div">
                                        <label for="degree" class="control-label">Degree:<sup>*</sup></label>
                                      </div>
                                      <div class="short-div">
                                          <div class="control-group radio inline">
                                          <label class="radio-inline">
                                          <input type="radio" name="degree" value="us" class="radio-control" id="degree" checked> Fahrenheit
                                              </label>
                                              <label class="radio-inline">
                                          <input type="radio" name="degree" value="si" class="radio-control" id="degree" > Celsius
                                              </label>
                                              </div>
                                      </div>
                                </div>
                            </div>
                            <br />
                            <div class="col-lg-6 col-md-6 col-sm-12" style="padding:0px; padding-right:15px;" align="right">
                              <div class="row">
                                 <button type="submit" value="Search" class="btn btn-primary" name="submit" id="submit"><span class="glyphicon glyphicon-search"></span> Search</button>
                                 <button style="border-color: #007299; text-align: right" type="button" value="Clear" class="btn btn-default outline" onclick="resetVlaues()"><span class="glyphicon glyphicon-refresh"></span> Clear</button>
                               </div>
                            </div>
                          </div>
                          <br />
                          <div class="col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-6 col-sm-offset-6" align="right">
                               <label class="control-label" for="PoweredBy">Powered by:</label>
                                <a href="http://forecast.io/" target="_blank"> <img src="http://cs-server.usc.edu:45678/hw/hw8/images/forecast_logo.png" width="100px" height="50px" /></a>
                        </div>
                        <br />
                        </div>
                        <script>
                            var statesArray = {"AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming", };
                            for(key in statesArray){
                                var x = document.getElementById("selectState");
                                if(x.nodeType == 1){
                                    var option = document.createElement("option");
                                    option.text = statesArray[key];
                                    option.setAttribute("value", key);
                                    x.add(option);
                                }else
                                    alert("Not an element!");
                            } 
                        </script>
                    </form>
                <br />
                <br /><br />
                </fieldset>
            <hr>
            <div>
                <div class="tabClass" id="tabClass">
                    <ul class="nav nav-tabs" role="tablist" id="myTabs">
                        <li role="presentation" class="active"><a href="#rightnow" aria-controls="rightnow" role="tab" data-toggle="tab">Right Now</a></li>
                        <li role="presentation"><a href="#next24hours" aria-controls="next24hours" role="tab" data-toggle="tab">Next 24 Hours</a></li>
                        <li role="presentation"><a href="#next7days" aria-controls="next7days" role="tab" data-toggle="tab">Next 7 Days</a></li>
                    </ul> 
                    <div class="tab-content">
                    <div role="tabpanel" class="tab-pane fade in active" id="rightnow">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" id="rightNowDiv1" style="padding: 0px;">
                            <!--h3>This is the first tab</h3-->
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" id="rightNowDiv2" style="padding: 0px;">
                            <!--h3>Cloud Map goes here</h3-->
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane fade" id="next24hours">
                        <!--h3>This is the second tab</h3-->
                            <table id="next24hoursTable" width="100%">
                                <tr>
                                    <td>
                            <!--div class="row" id="next24hours"-->
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><h5>Time</h5></div> 
                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h5>Summary</h5></div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><h5>Cloud Cover</h5></div>
                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h5>Temp</h5></div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><h5>View Details</h5></div>
                            <!--/div-->
                                    </td>
                                </tr>
                            </table>
                                <div id="tab2Id"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane fade" id="next7days" style="height:450px;">
                        <div class="col-lg-12 col-md-12" style="padding:0px; background-color: black;" id="innernext7days">
                        
                        </div>
                        <!--h3>This is the Third tab</h3></div-->
                    </div>
                </div>
            </div>
            </div>
            <br />
            <br />
        </body>
</html>