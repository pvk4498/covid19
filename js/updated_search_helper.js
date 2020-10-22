
let default_city='data';
var user_position;
//This function will be invoked when page is loaded
$( document ).ready(function() {
    console.log( "ready!" );
    gel_user_location(position_allowed, position_not_allowed)

});


function position_allowed(position){
    user_position=position;
    start(default_city);
}

function position_not_allowed(error){
    start(default_city);
}


function gel_user_location(positionSuccess, positionError) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
  } else {
    console.log("Geolocation is not supported by this browser.");
    position_not_allowed(null)
  }
}


function start(city_name){
    var temp=city_name.toLowerCase();
    var url = 'https://pvk4498.github.io/garage-search-engine/data/'+temp+'.json';
    var data = get_json_Data(url, sortResultByLocation);
}

function get_json_Data(url, callback) {
  var result;
  $.getJSON(url, callback(dropdown()));
  return result;
}

let i = 0;
function sortResultByLocation(result) {

  if(user_position) {
    
    for (i in result) {
            let current_lat = user_position.coords.latitude;
            let current_lon = user_position.coords.longitude;
            let json_lat = result[i].latitude;
            let json_lon = result[i].longitude;
            result[i]["distance"] = calculateDistance(current_lat, current_lon, result[i]["latitude"], result[i]["longitude"], "K");
          }

          result.sort(function (a, b) {
            return a.distance - b.distance;
          });
          
          displayData(result);
  }else{
    displayData(result);
  }
}


// sorts result according to dropdown option

function dropdown() {
  let city_option = document.getElementById('city_dropdown').value;
  console.log(city_option);
  start(city_option);
  
  /*arr.splice(0, arr.length);
  $.getJSON(url, function (data) {
    for (let i=0;i<data.length;i++) {
      if (data[i].city == option) {
        arr.push(data[i]);
      }

    }
  });
  console.log(arr);
  displayData(arr);*/


}

// populates the cards

function displayData(result) {
  var options = {
    valueNames: [
      'id',
      'name',
      'address',
      'city',
      'contact',
      'price',
      { name: 'image', attr: 'src' },
      { name: 'link', attr: 'href' }
    ],
    item: 'myitem',
    page: 10,
    pagination: true
  };

  var userList = new List('mylist', options, result);
  result.splice(0, result.length);

  
  userList.on('updated', function (list) {
    if (list.matchingItems.length > 0) {
      $('.no-result').hide()
    } else {
      $('.no-result').show()
    }
  });
  $('#clear-btn').click(function () {
    $('#search').val('');
    userList.search();
  });
}







// calculates the distance based on longitude and latitude
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var radlon1 = Math.PI * lon1 / 180
  var radlon2 = Math.PI * lon2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") { dist = dist * 1.609344 }
  if (unit == "N") { dist = dist * 0.8684 }
  return dist
}
