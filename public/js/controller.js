//desde aquí hacemos uso del objeto app que es nuestro modulo
//y de esta forma creamos un controlador, en este caso el controlador indexController,
//como vemos, hacemos uso de scope y sencillamente creamos un array y colocamos
//dos objetos dentro de él
//app.controller("indexController", function indexController($scope){
app.controller('indexController', function($scope, $http, $interval) {
	$scope.sortType     = 'name'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.buscador     = '';     // set the default search/filter term

	$scope.lastError    = 'NA';

	//Firt load
	load_enpoints();

	//Repeat every n milli
	$interval(function() {
		load_enpoints();
	},10000);

	function load_enpoints(){
		//$http.get('http://localhost:9090/list').success(function(data){
		$http.get('/list').success(function(data){
			  $scope.endpoints = data;
	    });
    };

	$scope.showModal = function() {

	}

	$scope.refreshBPT = function(ip, port) {
		var url = "http://" + ip + ":" + port  + "/BPT/proxy/BPTOperations";
		var message = { 'url': url }
		console.log("Ip: " + ip + ", port: " + port);

		var config = { headers: {'Content-Type': 'application/json'} }

		$http.post('/refreshBPT', message, config).success(function(data) {
			  //$scope.endpoints = data;
			  console.log('BPT refreshed!');
	    });
	}

	$scope.format = 'M/d/yy h:mm:ss a';
}) // Register the 'myCurrentTime' directive factory method.
    // We inject $interval and dateFilter service since the factory method is DI.
    .directive('myCurrentTime', ['$interval', 'dateFilter',
      function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
          var format,  // date format
              stopTime; // so that we can cancel the time updates

          // used to update the UI
          function updateTime() {
            element.text(dateFilter(new Date(), format));
          }

          // watch the expression, and update the UI on change.
          scope.$watch(attrs.myCurrentTime, function(value) {
            format = value;
            updateTime();
          });

          stopTime = $interval(updateTime, 1000);

          // listen on DOM destroy (removal) event, and cancel the next UI update
          // to prevent updating time after the DOM element was removed.
          element.on('$destroy', function() {
            $interval.cancel(stopTime);
          });
        }
      }]
 );

//más de lo mismo, pero en este caso creamos una variable llamada saludo y una función
//que gracias al objeto location y al método url nos redirigirá al login al hacer uso de ella
app.controller("homeController", function homeController($scope, $location){
	$scope.saludo = "Hola desde el controlador home :()";
	$scope.toLogin = function(){
		$location.url("/login");
	}
});

app.controller("loginController", function loginController($scope, $location){
	$scope.saludo = "Hola desde el controlador login, :)";
	$scope.toHome = function(){
		$location.url("/home");
	}
})
