angular.module('reg')
  .factory('TeamService', [
  '$http',
  'Session',
  function($http, Session){

    var teams = '/dev/api/teams';
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

      getPage: function(page, size, text){
        return $http.get(teams + '?' + $.param(
          {
            text: text,
            page: page ? page : 0,
            size: size ? size : 50
          })
        );
      },
    };
  }
  ]);
