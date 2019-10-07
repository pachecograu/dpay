MyApp.angular.controller('cobrosCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  console.log('en el cobrosCtrl');
  MyApp.fw7.panel.close();

  $scope.getCobros = function (params) {
    $scope.safeApply(function () {
      $scope.users = [];
    });
    var activo = true;
    if (status == 'a') {
      activo = true;
    } else if (status == 'i') {
      activo = false;
    }
    MyApp.fw7.dialog.preloader('Cargando...');
    $scope.db.collection("cobros").where("activo", "==", activo)
      .get()
      .then(function (querySnapshot) {
        $scope.cobros = {
          total: 0,
          data: []
        };
        MyApp.fw7.dialog.close();
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, doc.data());
          var cobro = {};
          cobro = doc.data();
          console.log(new Date(cobro.fecha.seconds * 1000));
          cobro.dateAbono = moment(cobro.fecha.seconds * 1000).format('MMMM D YYYY, h:mm:ss a');
          cobro.dateFormAbono = moment(cobro.fecha.seconds * 1000).startOf('day').fromNow();
          $scope.safeApply(function () {
            $scope.cobros.total += doc.data().abono;

            $scope.cobros.data.push(cobro);
          });
        });
      });
  };

  $scope.changeStatus = function (status) {
    $scope.safeApply(function () {
      $rootScope.userStatus = status;
    });
    $scope.getCobros(status);
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