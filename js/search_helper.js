function get_json_Data(url, callback) {

  var result;
  $.ajax({

    url: url,
    success: callback
  });
  return result;
}

var url = 'https://pvk4498.github.io/garage-search-engine/data/data.json';
var data = get_json_Data(url, getLocation);


let i = 0;
function getLocation(result) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        for (i in result) {
          let current_lat = position.coords.latitude;
          let current_lon = position.coords.longitude;
          let json_lat = result[i].latitude;
          let json_lon = result[i].longitude;
          result[i]["distance"] = calculateDistance(current_lat, current_lon, result[i]["latitude"], result[i]["longitude"], "K");
        }
        populate_dropdown();
      
        result.sort(function (a, b) {
          return a.distance - b.distance;
        });
        displayData(result);
      }, function (error) {
        // function is called when the user denies the permission for location
        console.log("user denied the permission");
        displayData(result);
      });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// populates the dropdown on load

function populate_dropdown() {

  let dropdown = $('#city_dropdown');
  let url1 = "https://pvk4498.github.io/garage-search-engine/data/city_list.json"
  dropdown.empty();
  dropdown.prop('selectedIndex', 0);
  $.getJSON(url1, function (data) {
    $.each(data, function (key, entry) {
      dropdown.append($('<option>' + entry.city + '</option>'));
    })
  });
}

// sorts result according to dropdown option

function dropdown() {
  let arr = [];
  let option = document.getElementById('city_dropdown').value;
  console.log(option);
  arr.splice(0, arr.length);
  $.getJSON(url, function (data) {
    for (let i=0;i<data.length;i++) {
      if (data[i].city == option) {
        arr.push(data[i]);
      }

    }
  });
  console.log(arr);
  displayData(arr);
  

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
