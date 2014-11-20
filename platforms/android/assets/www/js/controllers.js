angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, appConfig, sugarService) {
  sugarService.getMenu()
    .then(function(successmessage){
        angular.forEach(successmessage, function(value, key) {
          console.log(value);
            if(angular.equals(value.title, "mobile")){
              console.log("in if ", value.modules);
              $scope.menulists = value.modules;
            };
        });

    }, function(errormessage){
      console.log(errormessage);
    })

})

.controller('LoginCtrl',function($scope, $state, appConfig, sugarService){

    $scope.username = "";
    $scope.password = "";

    $scope.login = function(username, password){
      sugarService.showLoader();
      sugarService.loginUser(username, password)
        .then(function(successmessage){
          appConfig.session_id = successmessage.session_id;
          $state.transitionTo('app.getlists', {}, {reload: true, inherit: false, notify: true });
           sugarService.hideLoader();
           console.log("Session id using appconfig",appConfig.session_id);
        }, function(errormessage){
           sugarService.hideLoader();
           sugarService.showModalPopup(errormessage.name, errormessage.description);
        });
    };
})

.controller('GetlistsCtrl', function($scope, $stateParams, appConfig, sugarService) {
   sugarService.showLoader();
   sugarService.getList($stateParams.moduleId)
    .then(function(successmessage){
      console.log("success List",successmessage.values);
      $scope.getlists = successmessage.values;
      sugarService.hideLoader();
    },function(errormessage){
        console.log("Error List", errormessage);
        sugarService.hideLoader();
    });
  console.log("Parameters",$stateParams);
})

.controller('GetDetailCtrl', function($scope, $stateParams, appConfig) {
  sugarService.showLoader();
  $scope.myconstatn = appConfig.port;
  appConfig.port = "90";
  $scope.myconstatn = appConfig.port;
  sugarService.hideLoader();
});
