MyApp.angular.controller('usersCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el usersCtrl');
  MyApp.fw7.panel.close();

  $scope.userPendding = {
    data: {
      pendding: true
    }
  };
  $scope.pendding = 'true';

  $scope.changePendding = function (status) {
    console.log(status);
    if (status == 'true') {
      $scope.safeApply(function () {
        $scope.userPendding.data.pendding = true;
      });
    } else {
      $scope.safeApply(function () {
        $scope.userPendding.data.pendding = false;
      });
    }
  };

  $scope.getPrestamos = function (user) {
    try {
      user.data.pendding = false;
      user.data.prestamos = 0;
      $scope.db.collection("prestamos")
        .where("id_account", "==", $rootScope.accountSelected)
        .where("id_usuario", "==", user.id)
        .where("activo", "==", true)
        // .orderBy("fecha", "desc")
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            var prestamo = {
              id: doc.id,
              data: doc.data()
            };
            if (!prestamo.data.finish) {
              $scope.safeApply(function () {
                user.data.pendding = true;
                user.data.prestamos += 1;
              });
            }
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  function getUsers(status) {
    $scope.getUsers(status, function (user) {
      // console.log(user);
      if (user.data.activo) {
        $scope.getPrestamos(user);
      }
    });
  }

  $scope.changeStatus = function (status) {
    $scope.safeApply(function () {
      $rootScope.userStatus = status;
    });
    getUsers(status);
  };

  $scope.changeStatus($rootScope.userStatus);

  $scope.updateListUsers = function () {
    getUsers($rootScope.userStatus);
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