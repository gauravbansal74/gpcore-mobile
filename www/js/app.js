// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var db = null;
angular.module('starter', ['ionic', 'starter.controllers','ngCookies','ngCordova'])

.run(function($ionicPlatform, $ionicLoading, $cordovaSQLite, $cordovaNetwork) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB({ name: "glueown.db" });
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS glueplusdata (modulename text, documentid text, postdata1 text)');
  });
})
.constant("appConfig", {
  "url": "http://103.241.183.21/glueplus/core.glueplus/php_Calls/",
  "port": "80",
  "session_id":"0",
  "login_url" : "login.php",
  "get_menu_url" : "getmenu.php",
  "get_list_url" : "getlist.php?m=",
  "get_detail_url" :"getdetails.php?m=",
  "delete_record_url" : "deleterecord.php?m=",
  "get_form_url" : "getform.php?m=",
  "save_record_url" :"saverecord.php?m="
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

 
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.detailtabs',{
    url: "/detailtabs/:moduleId/:recordId",
    views: {
      'menuContent' :{
        templateUrl: "templates/detailtabs.html",
        controller: 'DetailTabsCtrl'
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent' :{
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent' :{
        templateUrl: "templates/browse.html"
      }
    }
  })
  .state('app.getlists', {
    url: "/getlists/:moduleId",
    views: {
      'menuContent' :{
        templateUrl: "templates/getlists.html",
        controller: 'GetlistsCtrl'
      }
    }
  })

  .state('app.login',{
    url: "/login",
    views: {
      'menuContent' :{
        templateUrl : "templates/login.html",
        controller : 'LoginCtrl'
      }
    }

  })
  

  .state('app.deleterecord',{
    url: "/deleterecord",
    views: {
      'menuContent' :{
        templateUrl : "templates/deleterecord.html",
        controller : 'DeleteRecordCrtl'
      }
    }

  })

  .state('app.createrecord',{
    url: "/createrecord/:moduleId",
    views: {
      'menuContent' :{
        templateUrl : "templates/createrecord.html",
        controller : 'CreateRecordCrtl'
      }
    }

  })

  .state('app.getdetail', {
    url: "/getdetail/:moduleId/:recordId",
    views: {
      'menuContent' :{
        templateUrl: "templates/getdetail.html",
        controller: 'GetDetailCtrl'
      }
    }
  })

  .state('app.saverecord',{
    url: "/saverecord",
    views :{
      'menuContent':{
        templateUrl : "templates/saverecord.html",
        controller : 'saveRecordCrtl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
})
.service('sugarService',function($http, $q, appConfig, $cookieStore, $ionicLoading, $ionicPopup, $cordovaNetwork, $cordovaSQLite){

  
  return({
    loginUser : loginUser,
    showLoader : showLoader,
    hideLoader : hideLoader,
    showModalPopup : showModalPopup,
    getMenu : getMenu,
    getList : getList,
    getDetail : getDetail,
    showModalPopupConfirm : showModalPopupConfirm,
    deleteRecord : deleteRecord,
    getForm : getForm,
    saveRecord : saveRecord,
    updateRecord : updateRecord,
    isOffline : isOffline,
    isOnline : isOnline,
    getNumber : getNumber
  });


  function getNumber(){
     var query = "SELECT * FROM glueplusdata";
     var myresponse = $cordovaSQLite.execute(db, query, []);
     return(myresponse.then(handleDbSuccess, handleDbSuccess));
  }

  function isOffline(){
    var isOffline = $cordovaNetwork.isOffline();
    return isOffline;
  }

  function isOnline(){
    var isOnline = $cordovaNetwork.isOnline();
    return isOnline;
  }

  function showLoader(){
    $ionicLoading.show({
        template: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true
      });
  }

  function hideLoader(){
    $ionicLoading.hide();
  }

  function showModalPopup(title, description){
      var response  = $ionicPopup.alert({
         title: title,
         template: description
       });
      return response;
      
  }


  function showModalPopupConfirm(title, description){
    var response = $ionicPopup.confirm({
       title: title,
       template: description
     });
    return response;
  }


function updateRecord(moduleId,recordId, a){

  if(isOnline() != true){
    var mobilenumber = "9573127285";
    var query = "INSERT INTO glueplusdata (modulename, documentid, postdata1) VALUES (?,?,?)";
    var request = $cordovaSQLite.execute(db, query, [moduleId, recordId, JSON.stringify(a)]);
      return(request.then(handleDbSuccess, handleDbSuccess));
  }else{
      var session_id = appConfig.session_id;
      var dbrecordId = 0;
      a['id'] = recordId;
      
        var request = $http({
                method : "POST",
                url : appConfig.url+''+appConfig.save_record_url+''+moduleId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                data : { 
                  'checkdata' : a,
                  'session_id' : session_id
                },
               transformRequest: serializeData
              });
      return(request.then(handleSuccess, handleError));
    }
  }

  function saveRecord(moduleId, a){
    var session_id = appConfig.session_id;
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.save_record_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data : { 
          'checkdata' : a,
          'session_id' : session_id
        },
       transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }

  function deleteRecord(moduleId, recordId){
    var session_id = appConfig.session_id;
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.delete_record_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : session_id,
          id : recordId
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }


   function getForm(moduleId){
    var session_id = appConfig.session_id;
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_form_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : session_id
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }

   function getDetail(moduleId, recordId){
    var session_id = appConfig.session_id;
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_detail_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : session_id,
          id : recordId
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }

  function getList(moduleId){
    var session_id = appConfig.session_id;
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_list_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : session_id
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }



  function getMenu(){
    var session_id = appConfig.session_id;
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_menu_url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : session_id
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }


  function loginUser(username, password){
    var request = $http({
      method : "POST",
      url : appConfig.url+''+appConfig.login_url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      data :{
        username : username,
        password : password
      },
      transformRequest: serializeData
    });
    return(request.then(handleSuccess, handleError));
  }


  function handleError(response) {
    if (! angular.isObject(response.data ) || !response.data.message) {
      return($q.reject(response.data));
    }
    return( $q.reject(response.data));
  }


  function handleSuccess(response) {
    return(response.data);
  }

  function handleDbSuccess(response){
    return(response);
  }

  function serializeData(data) {
    if (!angular.isObject(data)) {
      return((data == null ) ? "" : data.toString());
    }

    var buffer = [];
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      var value = data[name];
      if(angular.isObject(value)){
        angular.forEach(value, function(data, key) {
            buffer.push(
          encodeURIComponent("checkdata["+key+"]") + "=" + encodeURIComponent((data == null) ? "" : data)
          );
        });
      }else{
        buffer.push(
          encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
          );
      }
    }

    var source = buffer
    .join( "&" )
    .replace( /%20/g, "+" )
    ;
    return(source);
  }

});

