MyApp.angular.controller('cobrosCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  console.log('en el cobrosCtrl');
  MyApp.fw7.panel.close();

  $scope.activoCobros = 'a';

  $scope.cobros = {
    total: 0,
    data: []
  };
  $scope.getCobros = function (status) {
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
          cobro.dateFormAbono = moment(cobro.fecha.seconds * 1000).startOf('hour').fromNow();
          $scope.safeApply(function () {
            $scope.cobros.total += doc.data().abono;
            $scope.cobros.data.push(cobro);
          });
        });
      });
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