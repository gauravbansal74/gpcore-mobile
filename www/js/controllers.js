angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, appConfig, sugarService) {
  sugarService.getMenu()
    .then(function(successmessage){
        angular.forEach(successmessage, function(value, key) {
            if(angular.equals(value.title, "mobile")){
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
        }, function(errormessage){
           sugarService.hideLoader();
           sugarService.showModalPopup(errormessage.name, errormessage.description);
        });
    };
})

.controller('GetlistsCtrl', function($scope, $stateParams, appConfig, sugarService) {
   sugarService.showLoader();
   $scope.moduleName = $stateParams.moduleId;
   sugarService.getList($stateParams.moduleId)
    .then(function(successmessage){
      $scope.getlists = successmessage.values;
      sugarService.hideLoader();
    },function(errormessage){
        sugarService.hideLoader();
    });
})

.controller('GetDetailCtrl', function($scope, $state, $stateParams, appConfig, sugarService) {
  sugarService.showLoader();
  $scope.moduleId = $stateParams.moduleId;
  $scope.recordId = $stateParams.recordId;
  $scope.scope = {};

    sugarService.getForm($stateParams.moduleId)
      .then(function(successmessage){
        $scope.dataDetails = successmessage;
        sugarService.hideLoader();
      }, function(errormessage){
        sugarService.hideLoader();
      });

  sugarService.getDetail($stateParams.moduleId, $stateParams.recordId)
    .then(function(successmessage){
      angular.forEach(successmessage[0].rows, function(value, key) {
          angular.forEach(value, function(data, key1) {
            $scope.scope[data.name] = data.value;
          });
      });
      $scope.dataDetails = successmessage;
      sugarService.hideLoader();
    },function(errormessage){
        sugarService.hideLoader();
    });

    
    $scope.submit = function(){
      var a = {};
      a = $scope.scope;
      sugarService.updateRecord($stateParams.moduleId,$stateParams.recordId, a)
        .then(function(successmessage){
           sugarService.showModalPopup("Record Updated", "You have successfully updated a record.");
        }, function(errormessage){
          sugarService.showModalPopup("Oops.. Error", errormessage);
        });
    }

    $scope.deleterecord = function(moduleId, recordId){
      sugarService.showModalPopupConfirm("Delete","Do you reallly want to delete??")
        .then(function(data){
            if(data){
              sugarService.showLoader();
              sugarService.deleteRecord(moduleId, recordId)
                .then(function(successmessage){
                   $state.transitionTo('app.getlists',$stateParams, {reload: true, inherit: false, notify: true });
                }, function(errormessage){  
                  console.log(errormessage);
                });
              sugarService.hideLoader();
            }
        });
    };
  
})


.controller('DetailTabsCtrl', function($scope, $stateParams, appConfig, sugarService){
  sugarService.showLoader();
  $scope.moduleId = $stateParams.moduleId;
  $scope.recordId = $stateParams.recordId;
  $scope.deleterecord = function(){
    sugarService.showModalPopup("Delete","Do you reallly want to delete??");
  };
})

.controller('DeleteRecordCrtl', function($scope, $stateParams, appConfig, sugarService){
 
})

.controller('CreateRecordCrtl', function($scope, $stateParams, appConfig, sugarService){
    sugarService.showLoader();
    sugarService.getForm($stateParams.moduleId)
      .then(function(successmessage){
        $scope.dataDetails = successmessage;
        sugarService.hideLoader();
      }, function(errormessage){
        console.log(errormessage);
        sugarService.hideLoader();
      });

  $scope.scope = {};
   
    $scope.submit = function(){
      var a = {};
      a = $scope.scope;
      sugarService.saveRecord($stateParams.moduleId, a)
        .then(function(successmessage){
           sugarService.showModalPopup("Record Created", "You have successfully created a record.");
        }, function(errormessage){
          sugarService.showModalPopup("Oops.. Error", errormessage);
        });
    }
})



.controller('saveRecordCrtl',function($scope){


});