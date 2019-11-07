angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function($scope, $state, $stateParams, currentUser, settings, Utils, UserService, TeamService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.formData = {};
      $scope.teamPages = [];
      $scope.teams = [];

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      function updatePage(data){
        $scope.teams = data.teams;
        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++){
          p.push(i);
        }
        $scope.teamPages = p;
      }

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .then(response => {
            $scope.error = null;
            $scope.teammates = response.data;
          })
      }

      function _populateTeams() {
        TeamService
        .getPage($stateParams.page, $stateParams.size, "")
        .then(response => {
          updatePage(response.data);
        });
      }

      if ($scope.user.teamCode){
        _populateTeammates();
      } else {
        _populateTeams();
      }

      $scope.goToTeamPage = function(page){
        $state.go('app.team', {
          page: page,
          size: $stateParams.size || 50
        });
      };

      $scope.joinTeam = function(team){
        UserService
          .joinOrCreateTeam(team.name)
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            _populateTeammates();
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.createTeam = function(){
        UserService
          .joinOrCreateTeam($scope.code)
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            _populateTeammates();
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.searchTeams = function() {
        TeamService
          .getPage($stateParams.page, $stateParams.size, $scope.formData.teamSearchQuery)
          .then(response => {
            updatePage(response.data);
          });
      };

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            $scope.teammates = [];
          }, response => {
            $scope.error = response.data.message;
          }).then(() => {
            $scope.formData.teamSearchQuery = "";
            _populateTeams();
          });
      };

    }]);
