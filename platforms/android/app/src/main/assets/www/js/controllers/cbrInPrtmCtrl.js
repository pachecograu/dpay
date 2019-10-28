MyApp.angular.controller('cbrInPrtmCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', '$state', function ($scope, $rootScope, $stateParams, $filter, $state) {
  console.log('en el cbrInPrtmCtrl', $stateParams);
  MyApp.fw7.panel.close();

  $rootScope.params = $stateParams;

  $scope.cobros = {
    total: 0,
    data: []
  };
  $scope.getCobros = function (prtm) {
    try {
      $scope.safeApply(function () {
        $scope.cobros = {
          total: 0,
          data: []
        };
      });
      MyApp.fw7.dialog.preloader('Cargando...');
      $scope.db.collection("cobros")
        // .where("id_account", "==", $rootScope.accountSelected)
        .where("id_prestamo", "==", prtm)
        .where("activo", "==", true)
        // .orderBy("fecha", "desc")
        .get(getOptions)
        .then(function (querySnapshot) {
          $scope.cobros = {
            total: 0,
            data: []
          };
          MyApp.fw7.dialog.close();
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, doc.data());
            var cobro = {
              id: doc.id,
              data: doc.data()
            };
            // console.log(new Date(cobro.fecha));
            cobro.data.dateAbono = moment(new Date(cobro.data.fecha)).format('MMMM D YYYY, h:mm:ss a');
            cobro.data.dateFormAbono = moment(new Date(cobro.data.fecha)).startOf('second').fromNow();
            $scope.safeApply(function () {
              $scope.cobros.total += doc.data().abono;
              $scope.cobros.data.push(cobro);
              $scope.cobros.data.sort(function (a, b) {
                return new Date(b.data.fecha) - new Date(a.data.fecha);
              });
            });
          });
          // markerDates();
        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.DeleteCobro = function (cobro) {
    try {
      // alert(JSON.stringify(cobro));
      MyApp.fw7.dialog.confirm('¿Deseas eliminar cobro de ' + $filter('currency')(cobro.data.abono, '$', 0) + '?', 'Eliminando...',
        function (params) {

          cobro.data.deleted = new Date();
          cobro.data.activo = false;
          MyApp.fw7.dialog.preloader('Eliminando...');
          $scope.db.collection("cobros").doc(cobro.id).update(cobro.data)
            .then(function () {
              console.log("Document written with ID: ", cobro.id);
              $scope.updateListCobros();
              notify({
                text: '!Eliminado exitosamente!'
              });
              MyApp.fw7.dialog.close();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
              MyApp.fw7.dialog.close();
            });

        },
        function (params) {

        });
    } catch (error) {
      alert(error);
    }
  };

  $scope.updateListCobros = function () {
    $scope.getCobros($stateParams.idPrtm);
  };

  $scope.getCobros($stateParams.idPrtm);

  $scope.viewPrestamo($stateParams.idPrtm, function (prtm) {
    $scope.safeApply(function () {
      $scope.prtmDetail = prtm;
    });
  });

  $scope.openNewCobro = function () {
    newCobro.open();
  };

  $scope.tabs = [{
    id: 1,
    text: 'LISTA',
    state: true,
    class: 'button-active text-color-black',
    classContent: 'tab-active animated'
  }, {
    id: 2,
    text: 'CALENDARIO',
    state: false,
    class: '',
    classContent: 'animated'
  }];
  $scope.tabSelected = $scope.tabs[0];
  $scope.tabChange = function (tab) {
    for (var i = 0; i < $scope.tabs.length; i++) {
      $scope.safeApply(function () {
        $scope.tabs[i].state = false;
        $scope.tabs[i].class = '';
        $scope.tabs[i].classContent = 'animated';
      });
    }
    $scope.safeApply(function () {
      tab.state = true;
      tab.class = 'button-active text-color-black';
      tab.classContent = 'tab-active animated fadeIn';
      $scope.tabSelected = tab;
    });

    if (tab.id == 2) {
      markerDates();
    }
  };

  function markerDates() {
    for (var j = 0; j < $scope.cobros.data.length; j++) {
      var date = new Date($scope.cobros.data[j].data.fecha);
      calendarInline.params.events.push({
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        color: '#4cd964',
      });
    }
    calendarInline.update();
  }

  try {
    // var now = new Date();
    // var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var calendarInline = MyApp.fw7.calendar.create({
      containerEl: '#demo-calendar-inline-container',
      value: [new Date()],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      cssClass: 'color-theme-orange',
      events: [
        //- more events this day
        // {
        //   date: today,
        //   color: '#ff0000'
        // },
        // {
        //   date: today,
        //   color: '#00ff00'
        // },
      ],
      // weekHeader: false,
      renderToolbar: function () {
        return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
          '<div class="toolbar-inner">' +
          '<div class="left">' +
          '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
          '</div>' +
          '<div class="center"></div>' +
          '<div class="right">' +
          '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
          '</div>' +
          '</div>' +
          '</div>';
      },
      on: {
        init: function (c) {
          $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
          $$('.calendar-custom-toolbar .left .link').on('click', function () {
            calendarInline.prevMonth();
          });
          $$('.calendar-custom-toolbar .right .link').on('click', function () {
            calendarInline.nextMonth();
          });
        },
        monthYearChangeStart: function (c) {
          $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
        },
        dayClick: function (calendar, dayEl, year, month, day) {
          //  alert(year + ' - ' + month + ' - ' + day);
          $scope.safeApply(function () {
            $scope.eventSelected = [];
          });
          var dateEvent = year + '' + month + '' + day;
          for (var j = 0; j < $scope.cobros.data.length; j++) {
            var date = new Date($scope.cobros.data[j].data.fecha);
            // alert(date.getFullYear() + ' - ' + date.getMonth() + ' - ' + date.getDate());
            var dateCobro = date.getFullYear() + '' + date.getMonth() + '' + date.getDate();
            // alert(dateCobro + ' ---- ' + dateEvent);
            if (dateCobro == dateEvent) {
              // alert('entro');
              $scope.safeApply(function () {
                $scope.eventSelected.push($scope.cobros.data[j]);
              });
            }
          }
          // alert(JSON.stringify($scope.eventSelected));
        }
      }
    });
  } catch (error) {
    alert(error);
  }

}]);