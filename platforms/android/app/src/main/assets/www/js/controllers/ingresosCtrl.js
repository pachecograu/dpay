MyApp.angular.controller('ingresosCtrl', ['$scope', '$rootScope', '$filter', '$state', function ($scope, $rootScope, $filter, $state) {
  console.log('en el ingresosCtrl');
  MyApp.fw7.panel.close();

  $scope.activoIngresos = 'a';

  $scope.ingresos = {
    total: 0,
    data: []
  };
  $scope.getIngresos = function (status) {
    try {
      $scope.safeApply(function () {
        $scope.ingresos = {
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
      $scope.db.collection("ingresos")
        .where("id_account", "==", $rootScope.accountSelected)
        .where("activo", "==", activo)
        .get(getOptions)
        .then(function (querySnapshot) {
          $scope.ingresos = {
            total: 0,
            data: []
          };
          MyApp.fw7.dialog.close();
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, doc.data());
            var ingreso = {
              id: doc.id,
              data: doc.data()
            };
            ingreso.data.dateIngreso = moment(ingreso.data.fecha).format('MMMM D YYYY, h:mm:ss a');
            ingreso.data.dateFormIngreso = moment(ingreso.data.fecha).startOf('second').fromNow();
            if (ingreso.data.deleted) {
              ingreso.data.deletedIngreso = moment(ingreso.data.deleted).format('MMMM D YYYY, h:mm:ss a');
              ingreso.data.deletedFormIngreso = moment(ingreso.data.deleted).startOf('second').fromNow();
            }
            $scope.safeApply(function () {
              $scope.ingresos.total += doc.data().valor;
              $scope.ingresos.data.push(ingreso);
            });
            $scope.ingresos.data.sort(function (a, b) {
              return new Date(b.fecha) - new Date(a.fecha);
            });
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.DeleteIngreso = function (ingreso) {
    console.log(ingreso);
    MyApp.fw7.dialog.confirm('¿Deseas eliminar ingreso de ' + $filter('currency')(ingreso.data.valor, '$', 0) + '?', 'Eliminando...',
      function (params) {
        try {
          ingreso.data.deleted = new Date();
          ingreso.data.activo = false;
          MyApp.fw7.dialog.preloader('Eliminando...');
          $scope.db.collection("ingresos").doc(ingreso.id).update(ingreso.data)
            .then(function () {
              console.log("Document written with ID: ", ingreso.id);
              $scope.updateListIngresos();
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
      $scope.activoIngresos = status;
    });
    $scope.getIngresos(status);
  };

  $scope.changeStatus($scope.activoIngresos);

  $scope.updateListIngresos = function () {
    $scope.getIngresos($scope.activoIngresos);
  };

  $scope.openNewIngreso = function () {
    newIngreso.open();
  };


}]);