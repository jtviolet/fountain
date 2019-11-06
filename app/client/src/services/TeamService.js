angular.module('reg')
  .factory('TeamService', [
  '$http',
  'Session',
  function($http, Session){

    var teams = '/api/teams';
    var base = teams + '/';

    return {

      // ----------------------
      // Basic Actions
      // ----------------------
      /*
      get: function(id){
        return $http.get(base + id);
      },
      */

      getAll: function(){
        return $http.get(base);
      },
    };
  }
  ]);
