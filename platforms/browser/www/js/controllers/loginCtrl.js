MyApp.angular.controller('loginCtrl', ['$scope', '$state', function ($scope, $state) {
  console.log('en el login');
  if (fireAuth.currentUser) {
    $state.go("dashboard");
    return;
  }

  $scope.onSignIn = function(user) {
    try {
      console.log(user);
      if (fireAuth.currentUser) {
        // [START signout]
        fireAuth.signOut();
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
        fireAuth.signInWithEmailAndPassword(user.email, user.password)
          .then(function (res) {
            // alert('login' + res);
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