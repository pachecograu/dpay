MyApp.angular.controller('cbrInPrtmCtrl', ['$scope', '$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {
  console.log('en el cbrInPrtmCtrl', $stateParams);
  MyApp.fw7.panel.close();

  $rootScope.params = $stateParams;

  $scope.cobros = {
    total: 0,
    data: []
  };
  $scope.getCobros = function (prtm) {
    $scope.safeApply(function () {
      $scope.cobros = {
        total: 0,
        data: []
      };
    });
    MyApp.fw7.dialog.preloader('Cargando...');
    $scope.db.collection("cobros").where("id_prestamo", "==", prtm)
      .get()
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
          console.log(new Date(cobro.fecha.seconds * 1000));
          cobro.dateAbono = moment(new Date(cobro.fecha.seconds * 1000)).format('MMMM D YYYY, h:mm:ss a');
          cobro.dateFormAbono = moment(new Date(cobro.fecha.seconds * 1000)).startOf('hour').fromNow();
          $scope.safeApply(function () {
            $scope.cobros.total += doc.data().abono;
            $scope.cobros.data.push(cobro);
          });
        });
      });
  };

  $scope.updateListCobros = function () {
    $scope.getCobros($stateParams.idPrtm);
  };

  $scope.getCobros($stateParams.idPrtm);

  $scope.viewPrestamo($stateParams.idPrtm, function (prtm) {
    $scope.safeApply(function () {
      $scope.prtmDetail = prtm;
    });
  });

  $scope.openNewCobro = function () {
    newCobro.open();
  };

}]);