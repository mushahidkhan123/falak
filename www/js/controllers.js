
angular.module('app.controllers', ['firebase','ionic'])

.controller('createAnAccountCtrl', ['$scope', '$stateParams','Auth', '$firebase','sharedList','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName

function ($scope, $stateParams,Auth,$firebase, sharedList, $state) {
	var isChecked = $scope.isChecked;
 	//var ref =firebase.database().ref();
	//$scope.data = $firebaseObject(ref);
	 
	$scope.signUpUser = function(user) {
   		firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(userData){
 			firebase.database().ref('users/' + userData.uid).set({
			    firstName: user.personFirstName,
			    lastName: user.personLastName,
			    email: user.email,
			   // signUpAsChef: isChecked,
			    phoneNumber: user.phoneNumber,
			    likedDishes: "none",
			    idCardNumber: user.identificationNumber
			  });
 			sharedList.addItem(userData.uid);
			$state.go('gridView');

 		}).catch(function(error){
 			console.log(user);
			var errorCode = error.code;
			var errorMessage = error.message;
 			alert(errorMessage);
		}); 
 			 
 	}


}])
   
.controller('loginCtrl', ['$scope', '$stateParams', '$state','$firebase',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParamfs.parameterName
function (sharedList, $scope, $stateParams, $state, $firebase) {
 	$scope.goToSignUpPage = function() {
  		$state.go('createAnAccount');
 	}

	$scope.loginUser = function(user) {
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

.controller('gridViewCtrl', ['sharedList', '$scope', '$stateParams','$state','$firebase','$firebaseArray', '$ionicPopover','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function (sharedList, $scope, $stateParams, $state,$firebase, $firebaseArray, $ionicPopover, $ionicLoading) { 
 var loggedInUserId = "goe08sCzsAYgW6jW5fRrMCDD2Q93";
 
$scope.likedButtonStyle = {
	"font-size" :"27px",
 		"color":"#000000"
	}
	 var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';
	 var isDishLiked = false;

     $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hidden popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
 	var vm = this;
	$scope.readOnly = true;

	$scope.allUsersAndDishes = []

	//console.log("in here");
	 	var users = firebase.database().ref().child('users');

	 	var usersInArrayForm =$firebaseArray(users);

	 	usersInArrayForm.$loaded().then(function(){
	 		angular.forEach(usersInArrayForm, function(user){
	 			//console.log(user);
	 			var usersDishes = user["dish"];
	 			//console.log(usersDishes);
	 			var dishes=[];
	 			angular.forEach(usersDishes, function(dish) {
	 				//console.log(dish.length);
 	 				for(var i = 0; i < dish.length; i++) {
 	 					dishes[i]=dish[i]
  	 					$scope.allUsersAndDishes.push(dish[i]);

 	 						  	 						// set the rate and max variables
							   
 	 					//console.log(dish[i]);
 	 				}
 	 				//$scope.allUsersAndDishes.push(useridAndDishes);
 	 				//console.log(useridAndDishes['dishes']);
 	 
 	 			}) 
	 		})
 	 	});
  		  
	/*	users.on('value',function(snapshot){
		console.log(snapshot.val());	
	});
 	 */
	
$scope.dishLiked = function(dish) {
	 	var users = firebase.database().ref().child('users');
	 	var usersInArrayForm =$firebaseArray(users);
	 	var userLoggedIn;

	 	usersInArrayForm.$loaded().then(function(){
	 		angular.forEach(usersInArrayForm, function(user){
	 			// console.log(user);
 	 			 if(user.$id == loggedInUserId){
	 			 	if(user["likedDishes"] == "none") {
	 			 		console.log(dish);
	 			 		firebase.database().ref().child('users').child(loggedInUserId).child('likedDishes').set({"0": {
	 			 			"name" :dish["name"],
	 			 			"imageUrl" : dish["imageUrl"],
	 			 			"price" : dish["price"]
	 			 		}
	 			 	});
	/*firebase.database().ref().child('users').child(loggedInUserId).set({
		"0":
	});*/
					}
	 			 	//break;
	 			 }
 	 

 	 			}) 
	 		})



if(!isDishLiked) {
 	$scope.likedButtonStyle = {
		'color':'red',
			"font-size" :"27px",
				}
	isDishLiked = true;
	}
else{
	$scope.likedButtonStyle = {
			"font-size" :"27px",
		'color':'#000000'
	}
	isDishLiked = false;
}
}
	}
])
.controller('individualDishPageCtrl', ['$scope', '$stateParams', '$state','$firebase','sharedList', '$firebaseArray','$ionicModal',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParamfs.parameterName
function ($scope, $stateParams, $state, $firebase, sharedList, $firebaseArray, $ionicModal){ 
	var vm = this;

 	var dishes = sharedList.getDish();
	var dishInfo = dishes[0];
  
	
		var users = firebase.database().ref().child('users');

	 	var usersInArrayForm =$firebaseArray(users);

	 	usersInArrayForm.$loaded().then(function(){
	 		angular.forEach(usersInArrayForm, function(user){
   	 			if(user.$id == dishInfo.dishUserId) {
  	 				var usersDishes = user['dishes']['index'];
  	 				angular.forEach(usersDishes, function(dish){
  	 					if(dish.name == dishInfo.dishName) {
  	 						$scope.imageUrl = dish.imageUrl;
  	 						$scope.name = dish.name;
  	 						$scope.price = dish.price;
							  $scope.rating = {};
							  $scope.rating.rate = dish['averageRating'];
							  $scope.rating.max = 5;
							   $scope.readOnly = true; 
  	 					}
  	 				})
 
}
 	 			}) 
	 		})
	 		}]); 
//mushahid

	  
 