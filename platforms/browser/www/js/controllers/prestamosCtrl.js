MyApp.angular.controller('prestamosCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el prestamosCtrl');
  MyApp.fw7.panel.close();

  $scope.activoPrestamos = 'a';

  $scope.prestamos = {
    total: 0,
    data: []
  };
  $scope.getPrestamos = function (status) {
    try {
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
      $scope.db.collection("prestamos")
        .where("id_account", "==", $rootScope.accountSelected)
        .where("activo", "==", activo)
        .onSnapshot(function (querySnapshot) {
          $scope.prestamos = {
            total: 0,
            data: []
          };
          MyApp.fw7.dialog.close();
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, doc.data());
            var prestamo = {};
            prestamo = doc.data();
            console.log(new Date(prestamo.fecha));
            prestamo.dateAbono = moment(prestamo.fecha).format('MMMM D YYYY, h:mm:ss a');
            prestamo.dateFormAbono = moment(prestamo.fecha).startOf('second').fromNow();
            prestamo.dateTrans = moment(new Date()).diff(moment(new Date(prestamo.fecha)), 'weeks');
            prestamo.semPas = prestamo.semanas;
            if (prestamo.dateTrans > prestamo.semanas) {
              prestamo.semPas = prestamo.dateTrans;
            }
            $scope.safeApply(function () {
              $scope.prestamos.total += doc.data().valor;
              $scope.prestamos.data.push(prestamo);
            });
            $scope.prestamos.data.sort(function (a, b) {
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
      $scope.activoPrestamos = status;
    });
    $scope.getPrestamos(status);
  };

  $scope.changeStatus($scope.activoPrestamos);

  $scope.updateListPrestamos = function () {
    $scope.getPrestamos($scope.activoPrestamos);
  };

}]);