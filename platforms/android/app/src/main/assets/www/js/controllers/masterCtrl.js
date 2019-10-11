MyApp.angular.controller('masterCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  console.log('en el master');
  moment.locale('es');
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
    totalCartera: 0,
    data: []
  };
  $scope.cobros = {
    total: 0,
    data: []
  };

  $scope.newPrestamos = {
    valor: 0,
    semanas: 0,
    fecha: new Date()
  };

  $scope.newCobros = {
    abono: 0,
    fecha: new Date()
  };

  $scope.signOut = function () {
    MyApp.fw7.panel.close();
    cordova.plugins.firebase.auth.signOut();
  };

  $scope.userLoged = {
    navbar: false
  };

  $scope.initApp = function (fn) {
    // Listening for auth state changes.
    // [START authstatelistener]
    try {
      cordova.plugins.firebase.auth.onAuthStateChanged(function (user) {
        // alert(user);
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

          // $scope.db = window.firebase.firestore();
          // if (fn) {
          //   fn();
          // }
          $state.go("dashboard");
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          $scope.userLoged = {
            navbar: false
          };
          $state.go("login");
          // [END_EXCLUDE]
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  $scope.initApp();

  try {
    $scope.db = firestoreDpay;
  } catch (error) {
    alert(error);
  }

  try {
    $scope.db.collection("forma_pago").get().then(function (querySnapshot) {
      $scope.fpagos = [];
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, doc.data());
        $scope.safeApply(function () {
          $scope.fpagos.push(doc.data());
        });
      });
    });
  } catch (error) {
    alert(error);
  }

  $scope.getUsers = function (status, fn) {
    try {
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
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
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
    } catch (error) {
      alert(error);
    }
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

  $scope.saveUser = function (user) {
    try {
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

  $scope.DeleteUser = function (user) {
    console.log(user);
    MyApp.fw7.dialog.confirm('¿Deseas eliminar este usuario?', 'Eliminando...',
      function (params) {
        try {
          user.data.deleted = new Date();
          user.data.activo = false;
          MyApp.fw7.dialog.preloader('Eliminando...');
          $scope.db.collection("usuarios").doc(user.id).update(user.data)
            .then(function () {
              console.log("Document written with ID: ", user.id);
              $scope.getUsers($rootScope.userStatus);
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

  $scope.UpdateUser = function (user) {
    console.log(user);
    MyApp.fw7.dialog.confirm('¿Deseas actualizar la informacion de este usuario?', 'Actualizando...',
      function (params) {
        try {
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

  $scope.savePrestamo = function (prestamo) {
    try {
      console.log(prestamo);
      prestamo.id_usuario = $rootScope.paramUserId;
      // prestamo.fecha = new Date();
      prestamo.activo = true;
      MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("prestamos").add(prestamo)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          // $scope.getUsers($rootScope.userStatus);
          newPrestamo.close();
          notify({
            text: '¡Creado exitosamente!'
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

  $scope.saveCobro = function (cobro) {
    try {
      console.log(cobro);
      cobro.id_usuario = $rootScope.params.idUser;
      cobro.id_prestamo = $rootScope.params.idPrtm;
      // cobro.fecha = new Date();
      cobro.activo = true;
      MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("cobros").add(cobro)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          // $scope.getUsers($rootScope.userStatus);
          newCobro.close();
          notify({
            text: '¡Creado exitosamente!'
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

  $scope.viewUser = function (user, fn) {
    try {
      console.log(user);
      MyApp.fw7.preloader.show();
      $scope.db.collection("usuarios").doc(user)
        .get().then(function (doc) {
          console.log(doc)
          if (doc.exists) {
            console.log("Document data:", doc.data());
            if (fn) {
              fn(doc.data());
            } else {
              $scope.safeApply(function () {
                $scope.userItemCobro = doc.data();
              });
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
          MyApp.fw7.preloader.hide();
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.viewPrestamo = function (prestamo, fn) {
    try {
      console.log(prestamo);
      MyApp.fw7.preloader.show();
      $scope.db.collection("prestamos").doc(prestamo)
        .get().then(function (doc) {
          console.log(doc);
          if (doc.exists) {
            // alert("Document data: " + JSON.stringify(doc.data()));
            var prestamo = doc.data();
            prestamo.date = moment(new Date(prestamo.fecha)).format('MMMM D YYYY, h:mm:ss a');
            prestamo.dateFrom = moment(new Date(prestamo.fecha)).startOf('second').fromNow();
            prestamo.dateTrans = moment(new Date()).diff(moment(new Date(prestamo.fecha)), 'weeks');
            prestamo.semPas = prestamo.semanas;
            if (prestamo.dateTrans > prestamo.semanas) {
              prestamo.semPas = prestamo.dateTrans;
            }
            if (fn) {
              fn(prestamo);
            } else {
              $scope.safeApply(function () {
                $scope.prestamoItemCobro = prestamo;
              });
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
          MyApp.fw7.preloader.hide();
        });
    } catch (error) {
      alert(error);
    }
  };


}]);