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

      $scope.pages = [];
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
        $scope.pages = p;
      }

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .then(response => {
            $scope.error = null;
            $scope.teammates = response.data;
          })
      }

      TeamService
        .getPage($stateParams.page, $stateParams.size, $stateParams.query)
        .then(response => {
          updatePage(response.data);
        });

      function _populateTeams() {
        TeamService
          .getAll()
          .then(response => {
            $scope.error = null;
            $scope.teams = response.data.teams;
          })
      }

      if ($scope.user.teamCode){
        _populateTeammates();
      } 

      $scope.joinTeam = function(user, team){
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

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            $scope.teammates = [];
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.$watch('teamQueryText', function(queryText){
        TeamService
          .getPage($stateParams.page, $stateParams.size, queryText)
          .then(response => {
            updatePage(response.data);
          });
      });

    }]);
