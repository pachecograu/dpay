// Dom7
var MyApp = {};
var $$ = Dom7;

MyApp.config = {
};

MyApp.angular = angular.module('Dpay', ['ui.router']);

MyApp.fw7 = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto',
  // App routes
  //routes: routes,
});


// Init/Create main view
var mainView = MyApp.fw7.views.create('.view-main', {});

var newUser = MyApp.fw7.popup.create({
  el: '#create-user'
});
var editUser = MyApp.fw7.popup.create({
  el: '#edit-user'
});
var newPrestamo = MyApp.fw7.popup.create({
  el: '#create-prestamo'
});
var newCobro = MyApp.fw7.popup.create({
  el: '#create-cobro'
});
var newEgreso = MyApp.fw7.popup.create({
  el: '#create-egreso'
});

function notify(params) {
  var toast = MyApp.fw7.toast.create({
    text: params.text,
    closeTimeout: 3000,
  });
  toast.open();
}

var firestoreDpay;
var getOptions = {
  source: 'cache'
};

  if (cordova.platformId === "browser") {

    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyCjAHKrbSJcWcOvTNYuabPilKauSr1J1h8",
      authDomain: "d-pay-c6ed3.firebaseapp.com",
      databaseURL: "https://d-pay-c6ed3.firebaseio.com",
      projectId: "d-pay-c6ed3",
      storageBucket: "d-pay-c6ed3.appspot.com",
      messagingSenderId: "1091066079150",
      appId: "1:1091066079150:web:5c5c1bc4505b2f75"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firestoreDpay = firebase.firestore();
  }else{
    var options = {
      "datePrefix": '__DATE:',
      "fieldValueDelete": "__DELETE",
      "fieldValueServerTimestamp": "__SERVERTIMESTAMP",
      "persist": true,
      //"config": {}
    };

    Firestore.initialise(options).then(function (db) {
      // db.get().collection("forma_pago").get().then(function (querySnapshot) {
      //   querySnapshot.forEach(function (doc) {
      //     alert(doc.id + ' ' + JSON.stringify(doc.data()));
      //   });
      // });
      firestoreDpay = db.get();
    });
  }

  

console.log(cordova, window);