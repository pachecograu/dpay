MyApp.angular.controller('prestamosCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  console.log('en el prestamosCtrl');
  MyApp.fw7.panel.close();

  $scope.activoPrestamos = 'a';

  $scope.prestamos = {
    total: 0,
    data: []
  };
  $scope.getPrestamos = function (status) {
    $scope.safeApply(function () {
      $scope.prestamos = {
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
    $scope.db.collection("prestamos").where("activo", "==", activo)
      .get()
      .then(function (querySnapshot) {
        $scope.prestamos = {
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
            $scope.prestamos.total += doc.data().valor;
            $scope.prestamos.data.push(cobro);
          });
        });
      });
  };

  $scope.changeStatus = function (status) {
    $scope.safeApply(function () {
      $scope.activoPrestamos = status;
    });
    $scope.getPrestamos(status);
  };

  $scope.changeStatus($scope.activoPrestamos);

  $scope.updateListPrestamos = function () {
    $scope.getPrestamos($scope.activoPrestamos);
  };

}]);