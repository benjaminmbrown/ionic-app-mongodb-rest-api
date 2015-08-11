angular.module('bucketList.controllers', [])

	.controller('SignInCtrl', function($rootScope,$scope, API, $window){
		if($rootScope.isSessionActive()){
			$window.location.href=('#/bucket/list');
		}

		$scope.user = {
			email: '',
			password: ''
		}

		$scope.validateUser = function(){
			var email = this.user.email;
			var password = this.user.password;

			if(!email || !password){
				$rootScope.notify("Please enter valid credentials (email/pw)");
				return false;
			}

			$rootScope.show("Please wait... authenticating");

			API.signin({
				email:email,
				password: password
			}).success(function(data){
				$rootScope.setToken(email);
				$rootScope.hide();
				$window.location.href=('#/bucket/list');
			}).error(function(error){
				$rootScope.hide();
				$rootScope.notify("Invalid username or password");
			});
		}
	})

	.controller('SignUpCtrl', function($rootScope, $scope, API, $window){
		$scope.user = {
			email : '',
			password : '',
			name : ''
		}

		$scope.createUser = function(){
			var email = this.user.email;
			var password = this.user.password;
			var uName = this.user.name;

			if(!email || !password || !uName){
				$rootScope.notify("Please enter valid credentials (email/pw)");
				return false;
			}

			$rootScope.show("Please wait... Registering");

			API.signup({
				email:email,
				password: password,
				name: uName
			}).success(function(data){
				//after successful registration, forward to the list
				$rootScope.setToken(email);
				$rootScope.hide();
				$window.location.href=('#/bucket/list');
			}).error(function(error){
				$rootScope.hide();

				if(error.error && error.error.code ==11000){
					$rootScope.notify("User already exists with this email");
				}
				else{
					$rootScope.notify("Something went wrong.. try again. Sorry");		
				}
				
			});

		}

	})