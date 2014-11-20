angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, appConfig, sugarService) {
  sugarService.getMenu()
    .then(function(successmessage){
        angular.forEach(successmessage, function(value, key) {
          console.log(value);
            if(angular.equals(value.title, "mobile")){
              console.log("in if ");
              $scope.playlists = value.modules;
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
          $state.transitionTo('app.playlists', {}, {reload: true, inherit: true, notify: true });
           sugarService.hideLoader();
           console.log("Session id using appconfig",appConfig.session_id);
        }, function(errormessage){
           sugarService.hideLoader();
           sugarService.showModalPopup(errormessage.name, errormessage.description);
        })
    
    };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams, appConfig) {
  $scope.myconstatn = appConfig.port;
  appConfig.port = "90";
  $scope.myconstatn = appConfig.port;
});
