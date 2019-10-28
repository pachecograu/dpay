MyApp.angular.controller('dashboardCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el dashboard');
  MyApp.fw7.panel.close();

  // $scope.db = firebase.firestore();
  $scope.updateDashboard = function () {
    try {
      $scope.users = [];
      $scope.prestamos = {
        total: 0,
        totalCartera: 0,
        data: []
      };
      $scope.cobros = {
        total: 0,
        data: []
      };
      $scope.egresos = {
        total: 0,
        data: []
      };
      $scope.ingresos = {
        total: 0,
        data: []
      };
      // alert($rootScope.accountSelected);
      if ($rootScope.rollSelected == 'Administrador' && $rootScope.accountSelected) {
        MyApp.fw7.preloader.show();
        $scope.db.collection("usuarios")
          // .where("id_account", "array-contains", [$rootScope.accountSelected])
          .where("activo", "==", true)
          .onSnapshot(function (querySnapshot) {
            $scope.users = [];
            MyApp.fw7.preloader.hide();
            querySnapshot.forEach(function (doc) {
              // console.log(doc.id, doc.data());
              var user = {
                id: doc.id,
                data: doc.data()
              };
              if (user.data.id_account && user.data.id_account.length > 0) {
                for (var i = 0; i < user.data.id_account.length; i++) {
                  if (user.data.id_account[i] == $rootScope.accountSelected) {
                    $scope.safeApply(function () {
                      $scope.users.push(doc.data());
                    });
                  }
                }
              }
            });
          });
        $scope.db.collection("prestamos")
          .where("id_account", "==", $rootScope.accountSelected)
          .where("activo", "==", true)
          .onSnapshot(function (querySnapshot) {
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
          .where("id_account", "==", $rootScope.accountSelected)
          .where("activo", "==", true)
          .onSnapshot(function (querySnapshot) {
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
          .where("id_account", "==", $rootScope.accountSelected)
          .where("activo", "==", true)
          .onSnapshot(function (querySnapshot) {
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
          $scope.db.collection("ingresos")
            .where("id_account", "==", $rootScope.accountSelected)
            .where("activo", "==", true)
            .onSnapshot(function (querySnapshot) {
              $scope.ingresos = {
                total: 0,
                data: []
              };
              MyApp.fw7.preloader.hide();
              querySnapshot.forEach(function (doc) {
                // console.log(doc.id, doc.data());
                $scope.safeApply(function () {
                  $scope.ingresos.total += doc.data().valor;
                  $scope.ingresos.data.push(doc.data());
                });
              });
            });
      } else if ($rootScope.rollSelected == 'Cliente' && $rootScope.dpayAccountSelected) {
        MyApp.fw7.preloader.show();
        $scope.db.collection("prestamos")
          .where("id_account", "==", $rootScope.dpayAccountSelected)
            .where("id_usuario", "==", $scope.userLoged.uid)
          .where("activo", "==", true)
          .onSnapshot(function (querySnapshot) {
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
          .where("id_account", "==", $rootScope.dpayAccountSelected)
            .where("id_usuario", "==", $scope.userLoged.uid)
          .where("activo", "==", true)
          .onSnapshot(function (querySnapshot) {
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
      }
    } catch (error) {
      alert(error);
    }
  };

  $scope.updateDashboard();

}]);