MyApp.angular.controller('loginCtrl', ['$scope', '$state', function ($scope, $state) {
  console.log('en el login');

  $scope.onSignIn = function(user) {
    try {
      console.log(user);
      if (cordova.plugins.firebase.auth.currentUser) {
        // [START signout]
        cordova.plugins.firebase.auth.signOut();
        // [END signout]z
      } else {
        if (user.email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (user.password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        cordova.plugins.firebase.auth.signInWithEmailAndPassword(user.email, user.password)
          .then(function (res) {
            console.log('login', res);
            //$scope.initApp();
            $state.go("dashboard");
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
    } catch (error) {
      alert(error);
    }
  };

}]);