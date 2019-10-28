MyApp.angular.controller('egresosCtrl', ['$scope', '$rootScope', '$filter', '$state', function ($scope, $rootScope, $filter, $state) {
  console.log('en el egresosCtrl');
  MyApp.fw7.panel.close();

  $scope.activoEgresos = 'a';

  $scope.egresos = {
    total: 0,
    data: []
  };
  $scope.getEgresos = function (status) {
    try {
      $scope.safeApply(function () {
        $scope.egresos = {
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
      $scope.db.collection("egresos")
        .where("id_account", "==", $rootScope.accountSelected)
        .where("activo", "==", activo)
        .get(getOptions)
        .then(function (querySnapshot) {
          $scope.egresos = {
            total: 0,
            data: []
          };
          MyApp.fw7.dialog.close();
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, doc.data());
            var egreso = {
              id: doc.id,
              data: doc.data()
            };
            egreso.data.dateEgreso = moment(egreso.data.fecha).format('MMMM D YYYY, h:mm:ss a');
            egreso.data.dateFormEgreso = moment(egreso.data.fecha).startOf('second').fromNow();
            if (egreso.data.deleted) {
              egreso.data.deletedEgreso = moment(egreso.data.deleted).format('MMMM D YYYY, h:mm:ss a');
              egreso.data.deletedFormEgreso = moment(egreso.data.deleted).startOf('second').fromNow();
            }
            $scope.safeApply(function () {
              $scope.egresos.total += doc.data().valor;
              $scope.egresos.data.push(egreso);
            });
            $scope.egresos.data.sort(function (a, b) {
              return new Date(b.fecha) - new Date(a.fecha);
            });
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.DeleteEgreso = function (egreso) {
    console.log(egreso);
    MyApp.fw7.dialog.confirm('¿Deseas eliminar egreso de ' + $filter('currency')(egreso.data.valor, '$', 0) + '?', 'Eliminando...',
      function (params) {
        try {
          egreso.data.deleted = new Date();
          egreso.data.activo = false;
          MyApp.fw7.dialog.preloader('Eliminando...');
          $scope.db.collection("egresos").doc(egreso.id).update(egreso.data)
            .then(function () {
              console.log("Document written with ID: ", egreso.id);
              $scope.updateListEgresos();
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

  $scope.changeStatus = function (status) {
    $scope.safeApply(function () {
      $scope.activoEgresos = status;
    });
    $scope.getEgresos(status);
  };

  $scope.changeStatus($scope.activoEgresos);

  $scope.updateListEgresos = function () {
    $scope.getEgresos($scope.activoEgresos);
  };

  $scope.openNewEgreso = function () {
    newEgreso.open();
  };


}]);