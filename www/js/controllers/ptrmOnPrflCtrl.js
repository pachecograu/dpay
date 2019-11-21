MyApp.angular.controller('ptrmOnPrflCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', '$state', function ($scope, $rootScope, $stateParams, $filter, $state) {
  console.log('en el ptrmOnPrflCtrl', $stateParams);
  MyApp.fw7.panel.close();

  $rootScope.paramUserId = $stateParams.idUser;

  $scope.getCobros = function (prtm) {
    try {
      $scope.db.collection("cobros")
        // .where("id_account", "==", $rootScope.accountSelected)
        .where("id_prestamo", "==", prtm.id)
        .where("activo", "==", true)
        // .orderBy("fecha", "desc")
        .get(getOptions)
        .then(function (querySnapshot) {
          var cobros = {
            total: 0,
            data: []
          };
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            cobros.total += doc.data().abono;
            cobros.data.push(doc.data());
          });
          // console.log(new Date(prtm.data.fecha));
          prtm.data.dateAbono = moment(new Date(prtm.data.fecha)).format('MMMM D YYYY, h:mm:ss a');
          prtm.data.dateFormAbono = moment(new Date(prtm.data.fecha)).startOf('second').fromNow();
          prtm.data.dateTrans = moment(new Date()).diff(moment(new Date(prtm.data.fecha)), 'weeks');
          prtm.data.semPas = prtm.data.semanas;
          if (!prtm.data.fijo) {
            if (prtm.data.dateTrans > prtm.data.semanas) {
              prtm.data.semPas = prtm.data.dateTrans;
            }
          }
          if (cobros.total >= (prtm.data.valor + (prtm.data.valor * ((prtm.data.semPas * 5) / 100)))) {
            // prtm.data.bg = 'bg-color-gray';
            $scope.UpdatePrestamos(prtm, 'finish');
          }
          $scope.safeApply(function () {
            // console.log(prtm.id, prtm.data.bg);
            $scope.prestamos.total += prtm.data.valor;
            $scope.prestamos.data.push(prtm);
          });
          console.log($scope.prestamos);
          $scope.prestamos.data.sort(function (a, b) {
            return new Date(b.data.fecha) - new Date(a.data.fecha);
          });
        });
    } catch (error) {
      alert(error);
    }
  };

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
        .where("finish", "==", false)
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
            $scope.getCobros(prestamo);
            // console.log('joder', $scope.prestamos);
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