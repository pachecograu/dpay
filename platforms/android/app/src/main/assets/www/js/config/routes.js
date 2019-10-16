MyApp.angular.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.interceptors.push(function($q) {
    return {
      'request': function(config) {
        console.log('entro en request');
        //show();
        return $q.when(config);
      },
      'response': function(response) {
        console.log('entro en response');
        //hide();
        return $q.when(response);
      },
      'responseError': function(rejection) {
        console.log('entro en responseError');
        //hide();
        return $q.reject(rejection);
      }
    };
  });


  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/login");
  //
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "pages/login.html",
      controller: "loginCtrl"
    })
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "pages/dashboard.html",
      controller: "dashboardCtrl"
    })
    .state('users', {
      url: "/users",
      templateUrl: "pages/users.html",
      controller: "usersCtrl"
    })
    .state('cobros', {
      url: "/cobros",
      templateUrl: "pages/cobros.html",
      controller: "cobrosCtrl"
    })
    .state('prestamos', {
      url: "/prestamos",
      templateUrl: "pages/prestamos.html",
      controller: "prestamosCtrl"
    })
    .state('prtm-on-profile', {
      url: "/prtm-on-profile/:idUser",
      templateUrl: "pages/prtm-on-profile.html",
      controller: "ptrmOnPrflCtrl"
    })
    .state('cbr-in-prtm', {
      url: "/cbr-in-prtm/:idUser/:idPrtm",
      templateUrl: "pages/cbr-in-prtm.html",
      controller: "cbrInPrtmCtrl"
    })
    .state('egresos', {
      url: "/egresos",
      templateUrl: "pages/egresos.html",
      controller: "egresosCtrl"
    })
});
