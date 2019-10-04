MyApp.angular.controller('masterCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  console.log('en el master');

  $scope.safeApply = function (fn) {
    var phase = this.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
      if (fn && (typeof (fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  $rootScope.userStatus = 'a';

  $scope.newUser = {
    telefono: [''],
    id_f_pago: [{
      id: '1',
      descripcion: 'Efectivo'
    }]
  };

  $scope.editUser = {};

  $scope.users = [];
  $scope.prestamos = {
    total: 0,
    data: []
  };
  $scope.cobros = {
    total: 0,
    data: []
  };

  $scope.signOut = function () {
    MyApp.fw7.panel.close();
    firebase.auth().signOut();
  };

  $scope.userLoged = {
    navbar: false
  };

  $scope.initApp = function (fn) {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
      console.log(user);
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        $scope.userLoged.displayName = user.displayName;
        $scope.userLoged.email = user.email;
        $scope.userLoged.emailVerified = user.emailVerified;
        $scope.userLoged.photoURL = user.photoURL;
        $scope.userLoged.isAnonymous = user.isAnonymous;
        $scope.userLoged.uid = user.uid;
        $scope.userLoged.providerData = user.providerData;
        $scope.userLoged.navbar = true;

        $scope.db = firebase.firestore();
        if (fn) {
          fn();
        }
        // window.location.href = "#/dashboard";
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        $scope.userLoged = {
          navbar: false
        };
        window.location.href = "#/login";
        // [END_EXCLUDE]
      }
    });
  }

  $scope.initApp();

  $scope.db = firebase.firestore();

  $scope.db.collection("forma_pago").get().then((querySnapshot) => {
    $scope.fpagos = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
      $scope.safeApply(function () {
        $scope.fpagos.push(doc.data());
      });
    });
  });

  $scope.getUsers = function (status, fn) {
    $scope.safeApply(function () {
      $scope.users = [];
    });
    var activo;
    if (status == 'a') {
      activo = true;
    } else if (status == 'i') {
      activo = false;
    }
    MyApp.fw7.dialog.preloader('Cargando...');
    $scope.db.collection("usuarios").where("activo", "==", activo)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, doc.data());
          var user = {
            id: doc.id,
            data: doc.data()
          };
          $scope.safeApply(function () {
            $scope.users.push(user);
          });
        });
        MyApp.fw7.dialog.close();
        if (fn) {
          fn();
        }
      });
  };

  $scope.addTelAndTp = function (type) {
    if (type == 'tel') {
      $scope.newUser.telefono.push('');
    } else {
      if ($scope.newUser.id_f_pago.length < 2) {
        $scope.newUser.id_f_pago.push({
          id: '2',
          descripcion: 'Consignación'
        });
      }
    }
  };

  $scope.changeFp = function (fp) {
    console.log(fp);
  };

  $scope.saveUser = function (user) {
    console.log(user);
    user.creado = new Date();
    user.activo = true;
    MyApp.fw7.dialog.preloader('Guardando...');
    $scope.db.collection("usuarios").add(user)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        $scope.getUsers($rootScope.userStatus);
        newUser.close();
        notify({
          text: '¡Creado exitosamente!'
        })
        MyApp.fw7.dialog.close();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        MyApp.fw7.dialog.close();
      });
  };

  $scope.DeleteUser = function (user) {
    console.log(user);
    MyApp.fw7.dialog.confirm('¿Deseas eliminar este usuario?', 'Eliminando...',
      function (params) {
        user.data.deleted = new Date();
        user.data.activo = false;
        MyApp.fw7.dialog.preloader('Eliminando...');
        $scope.db.collection("usuarios").doc(user.id).update(user.data)
          .then(function () {
            console.log("Document written with ID: ", user.id);
            $scope.getUsers($rootScope.userStatus);
            notify({
              text: '!Eliminado exitosamente!'
            })
            MyApp.fw7.dialog.close();
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
            MyApp.fw7.dialog.close();
          });
      },
      function (params) {

      });
  };

  $scope.UpdateUser = function (user) {
    console.log(user);
    MyApp.fw7.dialog.confirm('¿Deseas actualizar la informacion de este usuario?', 'Actualizando...',
      function (params) {
        user.data.deleted = null;
        user.data.activo = true;
        MyApp.fw7.dialog.preloader('Actualizando...');
        $scope.db.collection("usuarios").doc(user.id).update(user.data)
          .then(function () {
            console.log("Document written with ID: ", user.id);
            $scope.getUsers($rootScope.userStatus);
            editUser.close();
            notify({
              text: '!Actualizado exitosamente!'
            })
            MyApp.fw7.dialog.close();
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
            MyApp.fw7.dialog.close();
          });
      },
      function (params) {

      });
  };


}]);