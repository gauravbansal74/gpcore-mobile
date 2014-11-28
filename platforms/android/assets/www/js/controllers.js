angular.module('starter.controllers', ['ngCookies'])

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
           sugarService.showModalPopup("Record Updated", JSON.stringify(successmessage));
        }, function(errormessage){
          sugarService.showModalPopup("Oops.. Error", JSON.stringify(errormessage));
        });
    }

    $scope.isOnline = function(){
        var mydata = sugarService.getNumber()
        .then(function(successmessage){
             $scope.isonlinedata = JSON.stringify(successmessage);
        }, function(errormessage){
             $scope.isonlinedata = JSON.stringify(errormessage);
        })
       
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
    var moduleId = $stateParams.moduleId;
    sugarService.getForm($stateParams.moduleId)
      .then(function(successmessage){
        //$scope.dataDetails = successmessage;
        if(successmessage.hasOwnProperty("rows") == true){
              caseTableResult = successmessage.rows;
              var mydata = JSON.parse(caseTableResult.item(0).moduledata);
              $scope.dataDetails = mydata;
              sugarService.hideLoader();
         }else{
             $scope.dataDetails = successmessage;
             sugarService.hideLoader();
         }
       // sugarService.showModalPopup("Success",JSON.stringify(successmessage));
      }, function(errormessage){
       // sugarService.showModalPopup("Error",JSON.stringify(errormessage));
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

.controller('saveRecordCrtl',function($scope){})

.controller('GetSyncCtrl',function($scope, sugarService){

    $scope.getmenu = function(){
      sugarService.getMenu()
        .then(function(successmessage){
            console.log(successmessage);
             

            sugarService.saveMenu("menu", successmessage)
                .then(function(successdata){
                    sugarService.showModalPopup("Success", JSON.stringify(successdata));
                }, function(errordata){
                    sugarService.showModalPopup("Oops.. Error", JSON.stringify(errordata));
                });
            
        }, function(errormessage){
            console.log(errormessage);
        });
    };


    $scope.getform = function(){
      sugarService.showLoader();
      sugarService.getOfflineMenu()
        .then(function(successmessage){
           if(successmessage.rows.length > 0) {
              caseTableResult = successmessage.rows;
              var mydata = JSON.parse(caseTableResult.item(0).moduleid);
              angular.forEach(mydata, function(value, key) {
                if(value.title == "mobile"){
                  angular.forEach(value.modules, function(data, index) {
                      //sugarService.showModalPopup("success 1", index);
                      sugarService.getForm(index)
                        .then(function(successdata){
                            sugarService.saveForm(index, successdata)
                              .then(function(sdata){
                              //  sugarService.showModalPopup("success 1", JSON.stringify(sdata));
                              sugarService.hideLoader();
                              }, function(edata){
                              //  sugarService.showModalPopup("success 1", JSON.stringify(edata));
                              sugarService.hideLoader();
                              });
                        }, function(errordata){
                          sugarService.hideLoader();
                        });
                  });
                }
              });
              
           }
        }, function(errormessage){
             sugarService.showModalPopup("Oops.. Error", JSON.stringify(successmessage));
             sugarService.hideLoader();
        });
      
    };


});