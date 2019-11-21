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

  $scope.newEmail = {
    email: "",
    password: ""
  };

  $scope.openNewEmail = function () {
    newEmail.open();
  };

  var registering = false;

  $scope.saveEmail = function (user) {
    try {
      if (user.email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (user.password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      MyApp.fw7.dialog.preloader('Registrando...');
      registering = true;
      fireAuth.createUserWithEmailAndPassword(user.email, user.password)
        .catch(function (error) {
          // Handle Errors here.
          alert(error);
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.saveAccount = function (user) {
    try {
      console.log(user);
      var account = {
        account: ['pachecograu'],
        dpay_accounts: ['wlozano'],
        email: user.email
      };
      newEmail.close();
      // MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("cuentas").doc(user.uid).set(account)
        .then(function () {
          // console.log("Document written with ID: ", docRef.id);
          // $scope.getUsers($rootScope.userStatus);
          notify({
            text: '¡Registrado exitosamente!'
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
    fecha: new Date(),
    fijo: false
  };

  $scope.newCobros = {
    abono: 0,
    fecha: new Date()
  };

  $scope.newEgresos = {
    valor: 0,
    fecha: new Date(),
    descripcion: ''
  };

  $scope.newIngresos = {
    valor: 0,
    fecha: new Date(),
    descripcion: ''
  };

  $scope.signOut = function () {
    MyApp.fw7.panel.close();
    fireAuth.signOut();
  };

  $scope.userLoged = {
    navbar: false,
    accounts: []
  };

  $rootScope.accountSelected = null;
  $rootScope.dpayAccountSelected = null;
  $scope.changeAccount = function (account) {
    // alert(account);
    $scope.safeApply(function () {
      if ($rootScope.rollSelected == 'Administrador') {
        $rootScope.accountSelected = account;
        $scope.updateDashboard();
      } else if ($rootScope.rollSelected == 'Cliente') {
        $rootScope.dpayAccountSelected = account;
        $scope.updateDashboard();
      }
    });
  };

  $rootScope.rollSelected = 'Administrador';
  $scope.SelectRoll = function (roll) {
    $scope.safeApply(function () {
      $rootScope.rollSelected = roll;
    });
    $state.go('dashboard');
  };

  $scope.getAccount = function (uid) {
    $scope.db.collection("cuentas")
      .doc(uid)
      .onSnapshot(function (doc) {
        // alert(JSON.stringify(doc));
        if (doc.exists) {
          console.log("Document data: ", doc.data());
          $scope.safeApply(function (params) {
            var dataAccount = doc.data();
            $scope.userLoged.accounts = dataAccount;
            if (!$scope.userLoged.accounts.account || $scope.userLoged.accounts.account.length == 0) {
              $rootScope.rollSelected = 'Cliente';
            } else {
              $rootScope.accountSelected = $scope.userLoged.accounts.account[0];
            }
            $rootScope.dpayAccountSelected = $scope.userLoged.accounts.dpay_accounts[0];
          });
          // alert($rootScope.accountSelected);
          $scope.updateDashboard();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
  };

  $scope.initApp = function (fn) {
    // Listening for auth state changes.
    // [START authstatelistener]
    try {
      fireAuth.onAuthStateChanged(function (user) {
        // alert(user);
        // [END_EXCLUDE]
        console.log(registering);
        if (user) {
          console.log(user);
          // User is signed in.
          $scope.userLoged.displayName = user.displayName;
          $scope.userLoged.email = user.email;
          $scope.userLoged.emailVerified = user.emailVerified;
          $scope.userLoged.photoURL = user.photoURL;
          $scope.userLoged.isAnonymous = user.isAnonymous;
          $scope.userLoged.uid = user.uid;
          $scope.userLoged.providerData = user.providerData;
          $scope.userLoged.navbar = true;

          if (registering) {
            $scope.saveAccount($scope.userLoged);
          }

          $scope.getAccount(user.uid);

          // $scope.db = window.firebase.firestore();
          // if (fn) {
          //   fn();
          // }
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
    $scope.db.collection("forma_pago")
      .onSnapshot(function (querySnapshot) {
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
      var activo;
      if (status == 'a') {
        activo = true;
      } else if (status == 'i') {
        activo = false;
      }
      MyApp.fw7.dialog.preloader('Cargando...');
      $scope.db.collection("usuarios")
        // .where("id_account", "array-contains", $rootScope.accountSelected)
        .where("activo", "==", activo)
        .onSnapshot(function (querySnapshot) {
          $scope.safeApply(function () {
            $scope.users = [];
          });
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
                    $scope.users.push(user);
                  });
                }
              }
            }
          });
          $scope.users.sort(function (a, b) {
            return new Date(b.data.creado) - new Date(a.data.creado);
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
      user.id_account = $rootScope.accountSelected;
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
      prestamo.id_account = $rootScope.accountSelected;
      prestamo.id_usuario = $rootScope.paramUserId;
      // prestamo.fecha = new Date();
      prestamo.activo = true;
      prestamo.data.finish = false;
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

  $scope.UpdatePrestamos = function (prestamo) {
    // console.log(prestamo);
    try {
      prestamo.data.finish = true;
      $scope.db.collection("prestamos").doc(prestamo.id).update(prestamo.data)
        .then(function () {
          console.log("Document updated with ID: ", prestamo.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.saveCobro = function (cobro) {
    try {
      console.log(cobro);
      cobro.id_account = $rootScope.accountSelected;
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

  $scope.savegreso = function (egreso) {
    try {
      console.log(egreso);
      egreso.id_account = $rootScope.accountSelected;
      // egreso.fecha = new Date();
      egreso.activo = true;
      MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("egresos").add(egreso)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          // $scope.getUsers($rootScope.userStatus);
          newEgreso.close();
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

  $scope.saveIngreso = function (ingreso) {
    try {
      console.log(ingreso);
      ingreso.id_account = $rootScope.accountSelected;
      // ingreso.fecha = new Date();
      ingreso.activo = true;
      MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("ingresos").add(ingreso)
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          // $scope.getUsers($rootScope.userStatus);
          newIngreso.close();
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
        // .where("id_account", "==", $rootScope.accountSelected)
        .onSnapshot(function (doc) {
          console.log(doc);
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
        // .where("id_account", "==", $rootScope.accountSelected)
        .onSnapshot(function (doc) {
          console.log(doc);
          if (doc.exists) {
            // alert("Document data: " + JSON.stringify(doc.data()));
            var prestamo = doc.data();
            prestamo.date = moment(new Date(prestamo.fecha)).format('MMMM D YYYY, h:mm:ss a');
            prestamo.dateFrom = moment(new Date(prestamo.fecha)).startOf('second').fromNow();
            prestamo.dateTrans = moment(new Date()).diff(moment(new Date(prestamo.fecha)), 'weeks');
            prestamo.semPas = prestamo.semanas;
            if (prestamo.dateTrans > prestamo.semanas && !prestamo.fijo) {
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

  $scope.tabsUser = [{
    id: 1,
    text: 'FORMULARIO',
    state: true,
    class: 'button-active text-color-black',
    classContent: 'tab-active animated'
  }, {
    id: 2,
    text: 'IMPORTAR',
    state: false,
    class: '',
    classContent: 'animated'
  }];
  $scope.tabSelected = $scope.tabsUser[0];
  $scope.tabChange = function (tab) {
    for (var i = 0; i < $scope.tabsUser.length; i++) {
      $scope.safeApply(function () {
        $scope.tabsUser[i].state = false;
        $scope.tabsUser[i].class = '';
        $scope.tabsUser[i].classContent = 'animated';
      });
    }
    $scope.safeApply(function () {
      tab.state = true;
      tab.class = 'button-active text-color-black';
      tab.classContent = 'tab-active animated fadeIn';
      $scope.tabSelected = tab;
    });

    if (tab.id == 2) {
      $scope.getClients();
    }
  };

  $scope.getClients = function () {
    try {
      MyApp.fw7.dialog.preloader('Cargando...');
      $scope.db.collection("usuarios")
        // .where("id_account", "array-contains", $rootScope.accountSelected)
        // .where("activo", "==", true)
        .onSnapshot(function (querySnapshot) {
          $scope.safeApply(function () {
            $scope.clients = [];
          });
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            var user = {
              id: doc.id,
              data: doc.data()
            };
            if (user.data.id_account && user.data.id_account.length > 0) {
              for (var i = 0; i < user.data.id_account.length; i++) {
                if (user.data.id_account[i] == $rootScope.accountSelected) {
                  console.log('pertenece');
                  user.data.pertenece = true;
                } else {
                  console.log('no pertenece');
                  user.data.pertenece = false;
                }
              }
            } else {
              console.log('no pertenece');
              user.data.pertenece = false;
            }
            $scope.safeApply(function () {
              $scope.clients.push(user);
            });
            $scope.clients.sort(function (a, b) {
              return new Date(b.data.creado) - new Date(a.data.creado);
            });
          });
          console.log($scope.clients);

          MyApp.fw7.dialog.close();
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.addingClient = function name(user) {
    try {
      console.log(user);
      var accounts = [];
      for (var i = 0; i < user.data.id_account.length; i++) {
        accounts.push(user.data.id_account[i]);
      }
      accounts.push($rootScope.accountSelected);
      // user.id_account.push($rootScope.accountSelected);
      // MyApp.fw7.dialog.preloader('Guardando...');
      $scope.db.collection("usuarios").doc(user.id).update({
          id_account: accounts
        })
        .then(function () {
          $scope.db.collection("cuentas").doc(user.id).update({
              dpay_accounts: accounts
            })
            .then(function () {
              notify({
                text: '¡Importado exitosamente!'
              });
              // MyApp.fw7.dialog.close();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              MyApp.fw7.dialog.close();
            });
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          MyApp.fw7.dialog.close();
        });
    } catch (error) {
      alert(error);
    }
  };

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
                if (prestamo.finish) {
                  prestamo.semPas = prestamo.semanas;
                } else if (prestamo.dateTrans > prestamo.semanas && !prestamo.fijo) {
                  prestamo.semPas = prestamo.dateTrans;
                }
                console.log(prestamo);
                
                $scope.prestamos.total += prestamo.valor;
                $scope.prestamos.totalCartera += prestamo.valor + (prestamo.valor * ((prestamo.semPas * 5) / 100));
                console.log($scope.prestamos.totalCartera)
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

}]);