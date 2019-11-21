MyApp.angular.controller('dashboardCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el dashboard');
  MyApp.fw7.panel.close();

  $scope.updateDashboard();

}]);