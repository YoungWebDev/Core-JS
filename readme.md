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
  
   **TEMPLATE ENGINE** (dom.module.js)
   
   Supported types of data: Array, Object, String.
    
  ```js
  

  coreJS.$scope({
    user: {name: 'John', last_name: 'Smith'},
    skills: [
        {name: 'PHP'},
        {name: 'Javascipt'}
    ],
    hello_msg: 'Hello world!'
  });
  
  coreJS.$scope('hello_msg', 'Hello World!');
  
  coreJS.$scope('user', {name:"John", last_name:"Smith"});
  
  coreJS.$scope().hello_msg = 'Hello world again!';
  
  Or simple
  
  $scope.hello_msg = 'Hello world!';
  
  $scope.user = {name:'John', last_name:'Smith'};
  
  $scope.skills = [
        {name: 'PHP'},
        {name: 'Javascipt'}
    ];
  
  OBJECT
  
  <div data-bind='user'>
      {{name}} {{last_name}}
  </div>
  
  ARRAY
  
  <div data-bind='skills'>
      I know {{name}}
  </div>
  
  STRING
  
  <p data-bind='hello_msg'></p>
  
  ```
  
   **TEMPLATE ENGINE (OLD, NO SUPPORT)** (tpl.module.js)
   
   Supported types of data: Array, Object, String.
   
   **WARNING** - This coreJS module can be unstable or do not work in proper way. It's alpha.
    
  ```js
  

  coreJS.tpl({
    user: {name: 'John', last_name: 'Smith'},
    skills: [
        {name: 'PHP'},
        {name: 'Javascipt'}
    ],
    hello_msg: 'Hello world!'
  });
  
  OBJECT
  
  <div data-bind='user'>
      {{name}} {{last_name}}
  </div>
  
  ARRAY
  
  <div data-bind='skills'>
      I know {{name}}
  </div>
  
  STRING
  
  <p data-bind='hello_msg'></p>
  
  ```

**DOM helper** (node.module.js)

  Getting a dom element:
    
  ```js
  coreJS.node('#element').get();
  ```
  
  Select: first, last, nth element.
    
  ```js
  coreJS.node('.elements').first().text('First element!');
  coreJS.node('.elements').last().text('Last element!');
  coreJS.node('.elements').nth(2).text('Third element!');
  
  To get
  
  coreJS.node('.elements').first().get();
  ```
  
  Changing/Getting* a html, text, of the element:
  
  *working only when number of dom elements === 1.
    
  ```js
  coreJS.node('#element').html('html here');
  
  coreJS.node('.elements').text('text here');
  
  var html = coreJS.node('#element').html();
  ```

