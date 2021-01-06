const angular = require("angular");
const swal = require("sweetalert");

angular.module('reg')
  .controller('ProfileCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Populate the school dropdown
      populateBusinessOrgs();
      _setupForm();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

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
                  $scope.user.profile.businessOrg = result.title.trim();
                }
              })
          });
      }

      function _updateUser(e){
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your profile has been saved.", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        // used to validate the UI fields that are required to be filled before submitting
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            // location: {
            //   identifier: 'location',
            //   rules: [
            //     {
            //       type: 'empty',
            //       prompt: 'Please let us know what location you will be working from!'
            //     }
            //   ]
            // },
            // shirtSize: {
            //   identifier: 'shirtSize',
            //   rules: [
            //     {
            //       type: 'empty',
            //       prompt: 'Please give us a shirt size!'
            //     }
            //   ]
            // },
            // signatureLiability: {
            //   identifier: 'signatureLiabilityWaiver',
            //   rules: [
            //     {
            //       type: 'empty',
            //       prompt: 'Please type your digital signature.'
            //     }
            //   ]
            // },
            // signaturePhotoRelease: {
            //   identifier: 'signaturePhotoRelease',
            //   rules: [
            //     {
            //       type: 'empty',
            //       prompt: 'Please type your digital signature.'
            //     }
            //   ]
            // },
            // signatureCodeOfConduct: {
            //   identifier: 'signatureCodeOfConduct',
            //   rules: [
            //     {
            //       type: 'empty',
            //       prompt: 'Please type your digital signature.'
            //     }
            //   ]
            // }
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);
