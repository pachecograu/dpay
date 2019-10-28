MyApp.angular.controller('misprestamosCtrl', ['$scope', '$rootScope', '$state', '$filter', function ($scope, $rootScope, $state, $filter) {
  console.log('en el misprestamosCtrl');
  MyApp.fw7.panel.close();

  $scope.prestamos = {
    total: 0,
    data: []
  };
  $scope.getPrestamos = function (user) {
    try {
      $scope.safeApply(function () {
        $scope.prestamos = {
          total: 0,
          data: []
        };
      });
      MyApp.fw7.dialog.preloader('Cargando...');
      $scope.db.collection("prestamos")
        .where("id_account", "==", $rootScope.dpayAccountSelected)
        .where("id_usuario", "==", user)
        .where("activo", "==", true)
        // .orderBy("fecha", "desc")
        .onSnapshot(function (querySnapshot) {
          $scope.prestamos = {
            total: 0,
            data: []
          };
          MyApp.fw7.dialog.close();
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            var prestamo = {
              id: doc.id,
              data: doc.data()
            };
            // console.log(new Date(prestamo.data.fecha));
            prestamo.data.dateAbono = moment(new Date(prestamo.data.fecha)).format('MMMM D YYYY, h:mm:ss a');
            prestamo.data.dateFormAbono = moment(new Date(prestamo.data.fecha)).startOf('second').fromNow();
            prestamo.data.dateTrans = moment(new Date()).diff(moment(new Date(prestamo.data.fecha)), 'weeks');
            prestamo.data.semPas = prestamo.data.semanas;
            if (prestamo.data.dateTrans > prestamo.data.semanas) {
              prestamo.data.semPas = prestamo.data.dateTrans;
            }
            $scope.safeApply(function () {
              $scope.prestamos.total += doc.data().valor;
              $scope.prestamos.data.push(prestamo);
            });
            $scope.prestamos.data.sort(function (a, b) {
              return new Date(b.data.fecha) - new Date(a.data.fecha);
            });
            // console.log($scope.prestamos);
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.updateListPrestamos = function () {
    $scope.getPrestamos($scope.userLoged.uid);
  };

  if ($scope.userLoged.uid) {
    $scope.getPrestamos($scope.userLoged.uid);
  }

}]);