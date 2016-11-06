angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('createAnAccount', {
    url: '/page6',
    templateUrl: 'templates/createAnAccount.html',
    controller: 'createAnAccountCtrl'
  })

  .state('login', {
    url: '/home',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('gridView', {
    url: '/page8',
    templateUrl: 'templates/gridView.html',
    controller: 'gridViewCtrl'
  })
  .state('individualDishPage', {
    url: '/page9',
    templateUrl: 'templates/individualDishPage.html',
    controller: 'individualDishPageCtrl'
  })
//$urlRouterProvider.otherwise('/page7')

 

});