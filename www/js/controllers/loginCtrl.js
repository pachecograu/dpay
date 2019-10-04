MyApp.angular.controller('loginCtrl', ['$scope', function ($scope) {
  console.log('en el login');

  $scope.ObjecttoParams = function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
  };

  $scope.onSignIn = function(user) {
    console.log(user);
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      if (user.email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (user.password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(function(res) {
        console.log('login', res);
        //$scope.initApp();
         window.location.href = "#/dashboard";
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);

        // [END_EXCLUDE]
      });
    }
  };

}]);