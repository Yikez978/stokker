angular.module('portfolio_manager', [ 'ngRoute' ])
.config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'navigation'
	}).when('/stocks', {
		templateUrl : 'stocks.html',
		controller : 'stocksController'
	}).when('/portfolio_detail', {
		templateUrl : 'portfolio_detail.html',
		controller : 'portfolioController'
	}).when('/stock_detail', {
		templateUrl : 'stock_detail.html',
		controller : 'stocksController'
	})
	.otherwise('/');

  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

})
.controller('home', function($scope, $http) {
	  
	  $http.get('/portfolios/').success(function(data) {
		    $scope.portfolios = data._embedded.portfolios;
		  })
})
.controller('portfolioController', function($scope, $http) {
	  
	  $http.get('/positions/').success(function(data) {
		    $scope.positions = data._embedded.positions;
		    
		    angular.forEach($scope.positions, function(position) {
		    	  $http.get(position._links.stock.href).success(function(stockdata){
		    		  position.stock = stockdata;
		    	  })
		    });
		    
		  })
})
.controller('stocksController', function($scope, $http) {
	  $http.get('/stocks/').success(function(data) {
		    $scope.stocks = data._embedded.stocks;
		  })
})
.controller('navigation',

  function($rootScope, $scope, $http, $location) {

  var authenticate = function(credentials, callback) {

    var headers = credentials ? {authorization : "Basic "
        + btoa(credentials.username + ":" + credentials.password)
    } : {};

    $http.get('user', {headers : headers}).success(function(data) {
      if (data.name) {
        $rootScope.authenticated = true;
      } else {
        $rootScope.authenticated = false;
      }
      callback && callback();
    }).error(function() {
      $rootScope.authenticated = false;
      callback && callback();
    });

  }

  authenticate();
  $scope.credentials = {};
  $scope.login = function() {
      authenticate($scope.credentials, function() {
        if ($rootScope.authenticated) {
          $location.path("/");
          $scope.error = false;
        } else {
          $location.path("/login");
          $scope.error = true;
        }
      });
  };
  
  $scope.logout = function() {
	  $http.post('logout', {}).success(function() {
	    $rootScope.authenticated = false;
	    $location.path("/");
	  }).error(function(data) {
	    $rootScope.authenticated = false;
	  });
	}


});