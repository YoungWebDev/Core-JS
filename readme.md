# CoreJS

  A JS library build from independant modules which each of them can work standalown.

#### MODULES:

  **AJAX** (ajax.module.js)

  This module allow you to make ajax calls with no effort. 

  Allowed methods: **POST, GET, UPDATE, PUT, DELETE, OPTIONS**.
  Allowed data types: **TEXT, HTML, JSON, XML**.
    
  ```js
  
  // ASYNC
  coreJS.ajax({
    url: '',
    method: '', // Default POST
    dataType: '', //Default JSON
    async: true, // Default true
    data: variable
  }).success(function(response) {
    
  }).error(function (response) {
  
  });
  
Or if you would like to put your success and error handlers into options object, now you can do it :-)
  
  coreJS.ajax({
    url: '',
    method: '', // Default POST
    dataType: '', //Default JSON
    async: true, // Default true
    data: variable,
    success: function (){},
    error: function (){}
  });
  
  //SYNC - Return whole XMLHttpRequest
  var request = coreJS.ajax({
    url: '',
    method: '', // Default POST
    dataType: '', //Default JSON
    async: false, // Default true
    data: variable
  }).request;
  ```
