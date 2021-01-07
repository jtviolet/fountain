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
    function ($scope, $state, $stateParams, currentUser, settings, Utils, UserService, TeamService, TEAM) {
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.formData = {};
      $scope.teamPages = [];
      $scope.teams = [];

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      $scope.data = {
        timezone: 'CST'
      }

      function updatePage(data) {
        $scope.teams = data.teams;
        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++) {
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

      function _populateTeams(page, size) {
        TeamService
          //.getPage(page, size, "")
          .getAll()
          .then(response => {
            updatePage(response.data);
          });
      }

      if ($scope.user.teamCode) {
        _populateTeammates();
        _populateTeams($stateParams.page, $stateParams.size);
      } else {
        _populateTeams($stateParams.page, $stateParams.size);
      }

      $scope.goToTeamPage = function (page) {
        _populateTeams(page, $scope.pageSize || 50)
      };

      $scope.joinTeam = function (team) {
        UserService
          .joinOrCreateTeam(team.name)
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            _populateTeammates();
          }, response => {
            $scope.error = response.data.message;
          }).then(() => {
            _populateTeams();
          });
      };

      $scope.createTeam = function () {
        UserService
          .joinOrCreateTeam($scope.code, $scope.data.timezone)
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            _populateTeammates();
          }, response => {
            $scope.error = response.data.message;
          }).then(() => {
            $scope.formData.teamSearchQuery = "";
            _populateTeams();
          });
      };

      $scope.searchTeams = function () {
        // If there is a search query with text, do a getPage
        if ($scope.formData.teamSearchQuery.trim())
          TeamService
            .getPage($stateParams.page, $stateParams.size, $scope.formData.teamSearchQuery)
            .then(response => {
              updatePage(response.data);
            });
        else {
          // No search query, so get all teams
          TeamService
            //.getPage(page, size, "")
            .getAll()
            .then(response => {
              updatePage(response.data);
            });
        }
      };

      $scope.leaveTeam = function () {
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
