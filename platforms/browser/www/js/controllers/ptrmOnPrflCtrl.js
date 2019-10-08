MyApp.angular.controller('ptrmOnPrflCtrl', ['$scope', '$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {
  console.log('en el ptrmOnPrflCtrl', $stateParams);
  MyApp.fw7.panel.close();

  $scope.activoPrestamos = 'a';

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

  $scope.updateListPrestamos = function () {
    $scope.getPrestamos($stateParams.idUser);
  };

  $scope.viewUser($stateParams.idUser, function (user) {
    console.log(user);
    $scope.userProfile = user;
    $scope.getPrestamos($stateParams.idUser);
  });

}]);