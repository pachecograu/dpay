MyApp.angular.controller('dashboardCtrl', ['$scope', function ($scope) {
  console.log('en el dashboard');
  MyApp.fw7.panel.close();

  // $scope.db = firebase.firestore();
  $scope.updateDashboard = function () {
    try {
      MyApp.fw7.preloader.show();
      $scope.db.collection("usuarios")
        .where("activo", "==", true)
        .get().then(function (querySnapshot) {
          $scope.users = [];
          MyApp.fw7.preloader.hide();
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            $scope.safeApply(function () {
              $scope.users.push(doc.data());
            });
          });
        });
      $scope.db.collection("prestamos")
        .where("activo", "==", true)
        .get().then(function (querySnapshot) {
          $scope.prestamos = {
            total: 0,
            totalCartera: 0,
            data: []
          };
          MyApp.fw7.preloader.hide();
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            $scope.safeApply(function () {
              var prestamo = doc.data();
              prestamo.dateTrans = moment(new Date()).diff(moment(new Date(prestamo.fecha)), 'weeks');
              prestamo.semPas = prestamo.semanas;
              if (prestamo.dateTrans > prestamo.semanas) {
                prestamo.semPas = prestamo.dateTrans;
              }
              $scope.prestamos.total += prestamo.valor;
              $scope.prestamos.totalCartera += prestamo.valor + (prestamo.valor * ((prestamo.semPas * 5) / 100));
              $scope.prestamos.data.push(prestamo);
            });
          });
        });
      $scope.db.collection("cobros")
        .where("activo", "==", true)
        .get().then(function (querySnapshot) {
          $scope.cobros = {
            total: 0,
            data: []
          };
          MyApp.fw7.preloader.hide();
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            $scope.safeApply(function () {
              $scope.cobros.total += doc.data().abono;
              $scope.cobros.data.push(doc.data());
            });
          });
        });
      $scope.db.collection("egresos")
        .where("activo", "==", true)
        .get().then(function (querySnapshot) {
          $scope.egresos = {
            total: 0,
            data: []
          };
          MyApp.fw7.preloader.hide();
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            $scope.safeApply(function () {
              $scope.egresos.total += doc.data().valor;
              $scope.egresos.data.push(doc.data());
            });
          });
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.updateDashboard();

}]);