angular.module('app.services', [])
 
.factory("Auth", ["$firebaseAuth",
	function($firebaseAuth){
		return $firebaseAuth();
	}])


.factory('sharedList', function() {
  var list = [];
  var dishList= [];

  return {
    addItem: addItem,	
    getList: getList,
    getDish: getDish,
    addIndividualDish: addIndividualDish
  };

  function addItem(item) {
    list.push(item);
  }

  function getList() {
    return list;
  }
  function getDish() {
  	return dishList;
  }
  function addIndividualDish(dish){
   	dishList.push(dish);
  }
})

.service('BlankService', [function(){

}]);