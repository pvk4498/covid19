function getId(){
    var url = window.location.search;
    url = url.replace("?id=", ''); // remove the ?
    console.log(url)
    return url
  ;}
 
  let id=getId();
  
   console.log(id);


  function get_json_Data(url,callback){

    var result;
    $.ajax({
      
      url:url,
      success:callback
    });
    return result;
  }
  

   
  var url=`https://pvk4498.github.io/garage-search-engine/data/businesses/${id}.json`;
  var data = get_json_Data(url,handleResult);
  
  function handleResult(result){
    console.log(result);
    
  
     var options={
          valueNames:[        
                      'name',
                      'address',
                      'city',
                      'contact',
                      'services' ,
                      { name: 'image', attr: 'src' } ,            
                      { name: 'map', attr: 'href' }             
                    ],
          item:'loading_container',
          page: 3,
          pagination: true
        };
       
     var userList = new List('main_container',options,result);
     
     $('#clear-btn').click(function() {
      $('#search').val('');
      userList.search();
   });
  
   
   
  }