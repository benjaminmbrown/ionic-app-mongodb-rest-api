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

	.controller('myListCtrl', function($rootScope,$scope,API,$timeout, $ionicModal, $window){
		
		$rootScope.on('fetchAll', function(){
			API.getAll($rootScope.getToken())
				.success(function(data,status,headers,config){
					$scope.list = [];
					for (var i = 0; i< data.length; i++){
						if(data[i].isComplete ==false){
							$scope.list.push(data[i]);
						}
					};

					if($scope.list.length==0){
						$scope.noData =true;
					}
					else{
						$scope.noData = false;
					}

					$ionicModal.fromTemplateUrl('templates/newItem.html',function(modal){
						$scope.newTemplate = modal;
					});

					$scope.newTask = function(){
						$scope.newTemplate.show();
					}
					$rootScope.hide();
				})
				.error(function(data, status, headers, config){
					$rootScope.hide();
					$rootScope.notify("Something went wrong. Please try again");

				});
		});
		
		$rootScope.$broadcast('fetchAll');

		$scope.markCompleted = function(id){
			$rootScope.show("Please wait, updating list");

			API.putItem(id,{
				isCompleted: true
			}, $rootScope.getToken())
				.success(function(data,status,headers,conifg){
					$rootScope.hide();
					$rootScope.doRefresh(1);
				})
				.error(function(data,status,headers,config){
					$rootScope.hide();
					$rootScope.notify("Something went wrong. Please try again");
				})
		};

		$scope.deleteItem = function(id){
			$rootScope.show("Wait, deleting item from list");

			API.deleteItem(id, $rootScope.getToken())
				.success(function(data,status,headers,conifg){
					$rootScope.hide();
					$rootScope.doRefresh(1);
				})
				.error(function(data,status,headers,config){
					$rootScope.hide();
					$rootScope.notify("Something went wrong. Please try again");
				})

		}
	})

	.controller('completedCtrl', function($rootScope,$scope,API, $window){

		$rootScope.on('fetchCompleted', function(){
			API.getAll($rootScope.getToken())
				.success(function(data,status,headers,config){
					$scope.list = [];
					for (var i = 0; i< data.length; i++){
						if(data[i].isCompleted == true){
							$scope.list.push(data[i]);
						}
					};

					if(data.length > 0 && $scope.list.length ==0){
						$scope.incomplete = true
					}
					else{
						$scope.incomplete = false;
					}

					if(data.length==0){
						$scope.noData =true;
					}
					else{
						$scope.noData = false;
					}
				})
				.error(function(data, status, headers, config){
					$rootScope.notify("Something went wrong. Please try again");
				});
		});

		$rootScope.$broadcast('fetchCompleted');

		$scope.deleteItem = function(id){
			$rootScope.show("Please wait. Deleting from list");

		API.deleteItem(id,$rootScope.getToken())
			.success(function(data){
				
				$rootScope.hide();
				$rootScope.doRefresh(2);
				
			}).error(function(error){
				$rootScope.hide();
				$rootScope.notify("Something went wrong. Please try again");
			});
		}
	})

	.controller('newCtrl', function($rootScope,$scope,API, $window){
		$scope.data = {
			item :''
		}

		$scope.close = function(){
			$scope.modal.hide();
		}

		$scope.createNew = function(){
			var item = this.data.item;

			if(!item) return;

			$scope.modal.hide();
			$rootScope.show();

			$rootScope.show("Wait a second... creating new item");

			var form = {
				item : item,
				isCompleted : false;
				user : $rootScope.getToken(),
				create : new Date.now(),
				updated : new Date.now()
			}

			API.saveItem(form, form.user)
				.success(function(data){
					$rootScope.hide();
					$rootScope.doRefresh(1);
				}).error(function(error){
					$rootScope.hide();
					$rootScope.notify("Something went wrong. Please try again");
				});
		};
	})

	



