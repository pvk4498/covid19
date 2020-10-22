
function get_json_Data(url, callback) {
  var result;
  $.getJSON(url, callback);
  return result;
}
  
  var url = 'https://api.covid19api.com/summary';
  var data = get_json_Data(url, getLocation);

  function getLocation(result){
    let data=result["Global"];
    console.log(data)
    displayData(data);   
  }


//  function populates the page dynamically
  function displayData(result) {
    var options = {
      valueNames: [
        'NewConfirmed',
        'NewDeaths',
        'NewRecovered',
        'TotalConfirmed',
        'TotalDeaths',
        'TotalRecovered'
      ],
      item: 'myitem',
    };

    
    document.getElementById("TotalConfirmed").style.backgroundColor = "lightblue";
    document.getElementById("NewConfirmed").style.backgroundColor = "yellow";
    document.getElementById("TotalRecovered").style.backgroundColor = "green";
    document.getElementById("TotalDeaths").style.backgroundColor = "red";
    document.getElementById("NewDeaths").style.backgroundColor = "orange";

    var userList = new List('mylist', options, result);
    
  }
