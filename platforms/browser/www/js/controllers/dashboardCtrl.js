MyApp.angular.controller('dashboardCtrl', ['$scope', function ($scope) {
  console.log('en el dashboard');
  MyApp.fw7.panel.close();

  // $scope.db = firebase.firestore();
  $scope.updateDashboard = function () {
    MyApp.fw7.preloader.show();
    $scope.db.collection("usuarios").get().then((querySnapshot) => {
      $scope.users = [];
      MyApp.fw7.preloader.hide();
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        $scope.safeApply(function () {
          $scope.users.push(doc.data());
        });
      });
    });
    $scope.db.collection("prestamos").get().then((querySnapshot) => {
      $scope.prestamos = {
        total: 0,
        data: []
      };
      MyApp.fw7.preloader.hide();
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        $scope.safeApply(function () {
          $scope.prestamos.total += doc.data().valor;
          $scope.prestamos.data.push(doc.data());
        });
      });
    });
    $scope.db.collection("cobros").get().then((querySnapshot) => {
      $scope.cobros = {
        total: 0,
        data: []
      };
      MyApp.fw7.preloader.hide();
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        $scope.safeApply(function () {
          $scope.cobros.total += doc.data().abono;
          $scope.cobros.data.push(doc.data());
        });
      });
    });
  };

  $scope.updateDashboard();

}]);