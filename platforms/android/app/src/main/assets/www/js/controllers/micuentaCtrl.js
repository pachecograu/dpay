MyApp.angular.controller('micuentaCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en mi cuenta', fireAuth.currentUser);
  MyApp.fw7.panel.close();

  $scope.myAccount = {
    nombre: '',
    telefono: [''],
    id_f_pago: [{
      id: '1',
      descripcion: 'Efectivo'
    }]
  };

  if ($scope.userLoged.uid) {
    $scope.viewUser($scope.userLoged.uid, function (user) {
      console.log(user);
      $scope.safeApply(function () {
        $scope.myAccount = user;
      });
    });
  }

  $scope.saveMyAccount = function (user) {
    try {
      console.log(user);
      if (user.nombre == "" || user.nombre.length < 3) {
        notify({
          text: '¡Debe colocar su nombre al menos!'
        });
        return;
      }
      user.email = $scope.userLoged.email;
      user.id_account = [];
      user.creado = new Date();
      user.activo = true;
      MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("usuarios").doc($scope.userLoged.uid).set(user)
        .then(function () {
          notify({
            text: '¡Guardado exitosamente!'
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
  };

}]);