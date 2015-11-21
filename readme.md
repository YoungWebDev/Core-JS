# CoreJS

  A JS library build from independant modules which each of them can work standalown.

#### MODULES:

  **AJAX** (ajax.module.js)

  This module allow you to make ajax calls with no effort. 

  Allowed methods (for now): **POST, GET**.
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
  
  //SYNC - Return whole XMLHttpRequest
  var request = coreJS.ajax({
    url: '',
    method: '', // Default POST
    dataType: '', //Default JSON
    async: false, // Default true
    data: variable
  }).request;
  ```
