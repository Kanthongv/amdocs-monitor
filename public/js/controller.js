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

	$scope.date = new Date();  //para mostrar la ultima actualizacion

	$scope.refreshStatusList = {} //Refresh BTP status

	$scope.errorCount = 0; //Error count to show in status bar as notification
	$scope.errorsJson = []

	//Firt load
	load_enpoints();

	//Repeat every n milli
	$interval(function() {
		load_enpoints();

		$scope.date = new Date();
	},10000);

	function load_enpoints(){
		$http.get('/list').success(function(data){
			  $scope.endpoints = data;

			  $scope.errorCount = loadErroneus(data).length;
	    });
    };

	function loadErroneus(jsonData) {
		var errors = []
		for (var value in jsonData) {
			if (!jsonData[value].isOK) {
				errors.push(jsonData[value]);
			}
		}
		console.log("Error count: " + errors.length);
		errorsJson = errors
		return errors;
	}

	$scope.refreshBPT = function(name, ip, port) {
		var url = "http://" + ip + ":" + port  + "/BPT/proxy/BPTOperations";
		var message = { 'url': url }
		console.log("Ip: " + ip + ", port: " + port);

		$scope.refreshStatusList[name] = "Actualizando BPT"

		var config = { headers: {'Content-Type': 'application/json'} }

		$http.post('/refreshBPT', message, config).success(function(data) {
			console.log('BPT refreshed!');
			if (data == "OK") {
				$scope.refreshStatusList[name] = "Actualizado!"
			} else {
				$scope.refreshStatusList[name] = ":("
			}
	    });
	}

	$scope.format = 'h:mm:ss a';

	// //UIB
	// $scope.status = {
 //      isopen: false
 //    };

 //    $scope.toggled = function(open) {
 //      console.log('Dropdown is now: ', open);
 //    };

 //    $scope.toggleDropdown = function($event) {
 //      $event.preventDefault();
 //      $event.stopPropagation();
 //      $scope.status.isopen = !$scope.status.isopen;
 //    };

 //    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

 	//array to hold the alerts to be displayed on the page
	$scope.alerts = [];
 	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(0);
 	};

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
