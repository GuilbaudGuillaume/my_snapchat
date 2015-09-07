var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {

		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider.
		state('index', {
		url : '/index',
		templateUrl : 'home.html',
		controller : 'inscription'
	}).
	state('accueil', {
		url : '/accueil',
		templateUrl : 'accueil.html',
		controller : 'Liste'
	}).
	state('camera', {
		url : '/camera',
		templateUrl : 'camera.html',
		controller : 'Photo'
	}).
	state('listeaccueil', {
		url : '/camera',
		templateUrl : 'camera.html',
		controller : 'Liste'
	}).
	state('reception', {
		url : '/reception',
		templateUrl : 'reception.html',
		controller : 'Liste'
	})

	$urlRouterProvider.otherwise('index');
})

app.controller('inscription', function ($scope, $http) {

	$scope.inscript = function () {
		({password: document.querySelector('.pwd').value, email : document.querySelector('.mail').value});
		$http.post('http://remikel.fr/api.php?option=inscription', {password: document.querySelector('.pwd').value, email : document.querySelector('.mail').value})
		.success(function (result) {
		});
	};

	$scope.connect = function () {
		$http.post('http://remikel.fr/api.php?option=connexion', {
			password: document.querySelector('.pwd').value,
			email : document.querySelector('.mail').value})
		.success(function (result) {
		   if (result.token !== null) {
			window.location.href = "#/accueil";
		}
		var email = document.querySelector('.mail').value;
		localStorage.setItem('token', result.token);
		localStorage.setItem('email', email);
		});
	}
});

app.factory('Camera', ['$q', function ($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function (result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      return q.promise;
    }
  }
}]);
	
app.controller('Photo', function ($scope, $http, Camera) {

  $scope.getPhoto = function() {
    Camera.getPicture().then(function (imageURI) {
  	  var image = imageURI;
      console.log(imageURI);
      var save = document.querySelector('.snap');
      save.src = imageURI;
    }, function(err) {
      console.err(err);
    });
  };
});

app.controller('Liste', function ($scope, $http) {
	
	$scope.liste = function () {
		$http.post('http://remikel.fr/api.php?option=toutlemonde', {
				token : localStorage.getItem('token'),
				email : localStorage.getItem('email')
			})
			.success(function (result) {
			$scope.resultat = result.data;
		});
	};

  $scope.envoie = function (id) {
  	document.addEventListener("deviceready", function () {
	  	var ft = new FileTransfer();
	    var options = new FileUploadOptions();
	    options.fileKey = "file";
	    options.mimeType = "image/jpeg";
	    options.fileName = "image.jpeg";
	    options.params = {
	    	token : localStorage.getItem('token'),
	    	email : localStorage.getItem('email'),
	    	u2 : id,
	    	temps : 5
	    }
	    options.headers = {};

	    ft.upload(document.querySelector('.snap').src, encodeURI("http://remikel.fr/api.php?option=image"),  function (res) {
	    		console.log(res);
	    	}, function (err) {
	    		console.log(err);
	    	}, options);
  			window.location.href = "#/reception";});
}

	$scope.recup = function (id) {

		
	}
});