MyApp.angular.controller('cobrosCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el cobrosCtrl');
  MyApp.fw7.panel.close();

  $scope.activoCobros = 'a';

  $scope.cobros = {
    total: 0,
    data: []
  };
  $scope.getCobros = function (status) {
    try {
      $scope.safeApply(function () {
        $scope.cobros = {
          total: 0,
          data: []
        };
      });
      var activo = true;
      if (status == 'a') {
        activo = true;
      } else if (status == 'i') {
        activo = false;
      }
      MyApp.fw7.dialog.preloader('Cargando...');
      $scope.db.collection("cobros")
        .where("id_account", "==", $rootScope.accountSelected)
        .where("activo", "==", activo)
        .get(getOptions)
        .then(function (querySnapshot) {
          $scope.cobros = {
            total: 0,
            data: []
          };
          MyApp.fw7.dialog.close();
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, doc.data());
            var cobro = {};
            cobro = doc.data();
            console.log(new Date(cobro.fecha));
            cobro.dateAbono = moment(cobro.fecha).format('MMMM D YYYY, h:mm:ss a');
            cobro.dateFormAbono = moment(cobro.fecha).startOf('second').fromNow();
            $scope.safeApply(function () {
              $scope.cobros.total += doc.data().abono;
              $scope.cobros.data.push(cobro);
            });
            $scope.cobros.data.sort(function (a, b) {
              return new Date(b.fecha) - new Date(a.fecha);
            });
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.changeStatus = function (status) {
    $scope.safeApply(function () {
      $scope.activoCobros = status;
    });
    $scope.getCobros(status);
  };

  $scope.changeStatus($scope.activoCobros);

  $scope.updateListCobros = function () {
    $scope.getCobros($scope.activoCobros);
  };

}]);