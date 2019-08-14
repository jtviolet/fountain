const swal = require('sweetalert');

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the business orgs dropdown
      populateBusinessOrgs();

      /**
       * TODO: JANK WARNING
       */
      function populateBusinessOrgs(){
        $http
          .get('/assets/businessOrgs.csv')
          .then(function(res){
            $scope.businessOrgs = res.data.split('\n');
            $scope.businessOrgs.push('Other');

            var content = [];

            for(i = 0; i < $scope.businessOrgs.length; i++) {
              $scope.businessOrgs[i] = $scope.businessOrgs[i].trim();
              content.push({title: $scope.businessOrgs[i]})
            }

            $('#businessOrg.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function(result, response) {
                  $scope.selectedUser.profile.businessOrg = result.title.trim();
                }
              })
          });
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };
    }]);
