
angular.module('app.controllers', ['firebase','ionic'])

.controller('createAnAccountCtrl', ['$scope', '$stateParams','Auth', '$firebase','sharedList','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName

function ($scope, $stateParams,Auth,$firebase, sharedList, $state) {
	var isChecked = $scope.isChecked;
	console.log("in the create account controller");
	//var ref =firebase.database().ref();
	//$scope.data = $firebaseObject(ref);
	 
	$scope.signUpUser = function(user) {
		console.log("inside here;");
		console.log("sigining up user now with email " + user.email);
 		firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(userData){
 			firebase.database().ref('users/' + userData.uid).set({
			    firstName: user.personFirstName,
			    lastName: user.personLastName,
			    email: user.email,
			   // signUpAsChef: isChecked,
			    phoneNumber: user.phoneNumber,
			    idCardNumber: user.identificationNumber
			  });
 			sharedList.addItem(userData.uid);
 			console.log(sharedList.getList());
 			console.log("about to go to grid view");
			$state.go('gridView');

 		}).catch(function(error){
 			console.log(user);
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorMessage);
			alert(errorMessage);
		}); 
 			 
 	}


}])
   
.controller('loginCtrl', ['$scope', '$stateParams', '$state','$firebase',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParamfs.parameterName
function (sharedList, $scope, $stateParams, $state, $firebase) {
	console.log("login controller is fired");
	$scope.goToSignUpPage = function() {
		console.log("Inside the goto sign up page fucn");
 		$state.go('createAnAccount');
			console.log("going to signup page now");
	}

	$scope.loginUser = function(user) {
		console.log("LOL");
		firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(userinfo){
			var useId = userinfo.uid;
			sharedList.addItem(userid);

			$state.go('gridView');

		}).catch(function(error) {
  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  alert(errorMessage);
  // ...
});
	}
}])

.controller('gridViewCtrl', ['sharedList', '$scope', '$stateParams','$state','$firebase','$firebaseArray',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function (sharedList, $scope, $stateParams, $state,$firebase, $firebaseArray) {
	console.log("entering gridview");
	var vm = this;
	$scope.readOnly = true;
	vm.listItems = sharedList.getList();
	console.log(vm.listItems);
	$scope.allUsersAndDishes = []

	//console.log("in here");
	 	var users = firebase.database().ref().child('users');

	 	var usersInArrayForm =$firebaseArray(users);

	 	usersInArrayForm.$loaded().then(function(){
	 		angular.forEach(usersInArrayForm, function(user){
	 			//console.log(user);
	 			var usersDishes = user["dishes"];
	 			//console.log(usersDishes);
	 			var dishes=[];
	 			angular.forEach(usersDishes, function(dish) {
	 				//console.log(dish.length);
 	 				for(var i = 0; i < dish.length; i++) {
 	 					dishes[i]=dish[i]
 	 					console.log(dish[i]);
 	 					$scope.allUsersAndDishes.push(dish[i]);

 	 						  	 						// set the rate and max variables
							   
 	 					//console.log(dish[i]);
 	 				}
 	 				//$scope.allUsersAndDishes.push(useridAndDishes);
 	 				//console.log(useridAndDishes['dishes']);
 	 
 	 			}) 
	 		})
	 		console.log($scope.allUsersAndDishes.length);
	 	});
	 	console.log($scope.allUsersAndDishes);
 		  
	/*	users.on('value',function(snapshot){
		console.log(snapshot.val());	
	});
 	 */
 	 $scope.goToThisDishPage = function(event) {
 	 	var arr = event.target.id;
 	 	var values = arr.split("--");
 	 	console.log(values[0]);
 	 	console.log(values[1]);
 	 	var dish = {
 	 		dishName: values[1],
 	 		dishUserId: values[0]
 	 	};
  	 	sharedList.addIndividualDish(dish);
 	 
  	 	$state.go('individualDishPage');
 	}

	}
])
.controller('individualDishPageCtrl', ['$scope', '$stateParams', '$state','$firebase','sharedList', '$firebaseArray','$ionicModal',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParamfs.parameterName
function ($scope, $stateParams, $state, $firebase, sharedList, $firebaseArray, $ionicModal){ 
	var vm = this;

	console.log("I AM IN HERE NOW");
	var dishes = sharedList.getDish();
	var dishInfo = dishes[0];
  
	
		var users = firebase.database().ref().child('users');

	 	var usersInArrayForm =$firebaseArray(users);

	 	usersInArrayForm.$loaded().then(function(){
	 		angular.forEach(usersInArrayForm, function(user){
	 			console.log(user.$id + "   " + dishInfo.dishUserId);
  	 			if(user.$id == dishInfo.dishUserId) {
  	 				var usersDishes = user['dishes']['index'];
  	 				angular.forEach(usersDishes, function(dish){
  	 					if(dish.name == dishInfo.dishName) {
  	 						$scope.imageUrl = dish.imageUrl;
  	 						$scope.name = dish.name;
  	 						$scope.price = dish.price;
  	 						console.log(dish.imageUrl);	

							  	 						// set the rate and max variables
							  $scope.rating = {};
							  $scope.rating.rate = dish['averageRating'];
							  $scope.rating.max = 5;
							   $scope.readOnly = true; 
  	 					}
  	 				})
 
}
 	 			}) 
	 		}) 

	 	$scope.openReviews = function() {
	 		console.log("Opening reviews");
	 			 		$scope.thanos = "LOLLL";
			 $ionicModal.fromTemplateUrl('my-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modal = modal;
		  });
		  $scope.openModal = function() {
		    $scope.modal.show();
		  };
		  $scope.closeModal = function() {
		    $scope.modal.hide();
		  };
		  // Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.modal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('modal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('modal.removed', function() {
		    // Execute action
		  });

	 	}
  }]);


 