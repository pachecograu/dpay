MyApp.angular.controller('usersCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el usersCtrl');
  MyApp.fw7.panel.close();

  $scope.changeStatus = function (status) {
    $scope.safeApply(function () {
      $rootScope.userStatus = status;
    });
    $scope.getUsers(status);
  };

  $scope.changeStatus($rootScope.userStatus);

  $scope.updateListUsers = function () {
    $scope.getUsers($rootScope.userStatus);
  };

  $scope.openNewUSer = function () {
    newUser.open();
  };

  $scope.openEditUSer = function (user) {
    for (var key in user) {
      $scope.safeApply(function () {
        $scope.editUser[key] = user[key];
      });
    }
    console.log($scope.editUser);
    editUser.open();
  };

}]);