angular.module('reg')
  .factory('SettingsService', [
  '$http',
  'CONFIG',
  function($http, CONFIG){

    var base = `${CONFIG.STAGE_ENDPOINT}/api/settings/`;

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      getWhitelistedDomains: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedDomains: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
    };
  }
  ]);
