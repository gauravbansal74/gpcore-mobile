// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $ionicLoading) {
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
  });
})
.constant("appConfig", {
  "url": "http://103.241.183.21/glueplus/core.glueplus/php_Calls/",
  "port": "80",
  "session_id":"0",
  "login_url" : "login.php",
  "get_menu_url" : "getmenu.php",
  "get_list_url" : "getlist.php?m=",
  "get_detail_url" :"getdetails.php?m="
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
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
  

  .state('app.getdetail', {
    url: "/getdetail/:moduleId/:getdetailId",
    views: {
      'menuContent' :{
        templateUrl: "templates/getdetail.html",
        controller: 'GetDetailCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
})
.service('sugarService',function($http, $q, appConfig, $ionicLoading, $ionicPopup){

  return({
    loginUser : loginUser,
    showLoader : showLoader,
    hideLoader : hideLoader,
    showModalPopup : showModalPopup,
    getMenu : getMenu,
    getList : getList,
    getDetail : getDetail
  });

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
      $ionicPopup.alert({
         title: title,
         template: description
       });
       alertPopup.then(function(res) {
         console.log('Thank you for not eating my delicious ice cream cone');
       });
      
  }


   function getDetail(moduleId, recordId){
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_detail_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : appConfig.session_id,
          id : recordId
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }

  function getList(moduleId){
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_list_url+''+moduleId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : appConfig.session_id
        },
        transformRequest: serializeData
      });
      return(request.then(handleSuccess, handleError));
  }



  function getMenu(){
      var request = $http({
        method : "POST",
        url : appConfig.url+''+appConfig.get_menu_url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        data :{
          session_id : appConfig.session_id
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
      buffer.push(
        encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
        );
    }

    var source = buffer
    .join( "&" )
    .replace( /%20/g, "+" )
    ;
    return(source);
  }

});

