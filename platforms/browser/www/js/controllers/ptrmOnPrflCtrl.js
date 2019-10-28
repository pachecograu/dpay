MyApp.angular.controller('ptrmOnPrflCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', '$state', function ($scope, $rootScope, $stateParams, $filter, $state) {
  console.log('en el ptrmOnPrflCtrl', $stateParams);
  MyApp.fw7.panel.close();

  $rootScope.paramUserId = $stateParams.idUser;

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
        .where("id_account", "==", $rootScope.accountSelected)
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

  $scope.DeletePrestamo = function (prestamo) {
    console.log(prestamo);
    MyApp.fw7.dialog.confirm('¿Deseas eliminar prestamo de ' + $filter('currency')(prestamo.data.valor, '$', 0) + '?', 'Eliminando...',
      function (params) {
        try {
          prestamo.data.deleted = new Date();
          prestamo.data.activo = false;
          MyApp.fw7.dialog.preloader('Eliminando...');
          $scope.db.collection("prestamos").doc(prestamo.id).update(prestamo.data)
            .then(function () {
              console.log("Document written with ID: ", prestamo.id);
              $scope.updateListPrestamos();
              notify({
                text: '!Eliminado exitosamente!'
              });
              MyApp.fw7.dialog.close();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              MyApp.fw7.dialog.close();
            });
        } catch (error) {
          alert(error);
        }
      },
      function (params) {

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