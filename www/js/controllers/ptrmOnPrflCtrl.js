MyApp.angular.controller('ptrmOnPrflCtrl', ['$scope', '$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {
  console.log('en el ptrmOnPrflCtrl', $stateParams);
  MyApp.fw7.panel.close();

  $rootScope.paramUserId = $stateParams.idUser;

  $scope.prestamos = {
    total: 0,
    data: []
  };
  $scope.getPrestamos = function (user) {
    $scope.safeApply(function () {
      $scope.prestamos = {
        total: 0,
        data: []
      };
    });
    MyApp.fw7.dialog.preloader('Cargando...');
    $scope.db.collection("prestamos").where("id_usuario", "==", user)
      .get()
      .then(function (querySnapshot) {
        $scope.prestamos = {
          total: 0,
          data: []
        };
        MyApp.fw7.dialog.close();
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, doc.data());
          var prestamo = {
            id: doc.id,
            data: doc.data()
          };
          console.log(new Date(prestamo.data.fecha.seconds * 1000));
          prestamo.data.dateAbono = moment(new Date(prestamo.data.fecha.seconds * 1000)).format('MMMM D YYYY, h:mm:ss a');
          prestamo.data.dateFormAbono = moment(new Date(prestamo.data.fecha.seconds * 1000)).startOf('day').fromNow();
          $scope.safeApply(function () {
            $scope.prestamos.total += doc.data().valor;
            $scope.prestamos.data.push(prestamo);
          });
          console.log($scope.prestamos)
        });
      });
  };

  $scope.updateListPrestamos = function () {
    $scope.getPrestamos($stateParams.idUser);
  };

  $scope.getPrestamos($stateParams.idUser);

  $scope.openNewPrestamo = function () {
    newPrestamo.open();
  };

}]);