angular.module('reg')
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

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
<<<<<<< HEAD
=======
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
>>>>>>> 01ae98840fb68071f1ec7d5b19ba0166910e5d24
      getWhitelistedDomains: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedDomains: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
<<<<<<< HEAD
      }
    };
=======
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },
      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
      updateAllowMinors: function(allowMinors){
        return $http.put(base + 'minors', { 
          allowMinors: allowMinors 
        });
      },
    };

>>>>>>> 01ae98840fb68071f1ec7d5b19ba0166910e5d24
  }
  ]);
