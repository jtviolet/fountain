var _ = require('underscore');
var async = require('async');
var User = require('../models/User');

// In memory stats.
var stats = {};
function calculateStats() {
  console.log('Calculating stats...');
  var newStats = {
    lastUpdated: 0,
    users: {
      numberSignedUp: 0,
      numberVerified: 0,
      numberCompletedRegistration: 0,
      numberCheckedin: 0,
      numberPreviouslyAttendedHackathons: 0
    },
    teams: {
      numberTeams: 0,
      numberUsersWithoutTeams: 0,
      numberTeamsOneUser: 0,
      averageTeamSize: 0
    },
    swag: {
      shirtSizes: {
        'XS': 0,
        'S': 0,
        'M': 0,
        'L': 0,
        'XL': 0,
        'XXL': 0,
        'WXS': 0,
        'WS': 0,
        'WM': 0,
        'WL': 0,
        'WXL': 0,
        'WXXL': 0,
        'None': 0
      }
    },
    hardware: {
      numberUsersRequestingFireeyeHardware: 0,
      numberUsersRequestingThirdpartyHardware: 0
    },
    software: {
      numberUsersRequestingFireeyeSoftware: 0,
      numberUsersRequestingThirdpartySoftware: 0
    },
    locations: []
  };

  User
    .find({})
    .exec(function (err, users) {
      if (err || !users) {
        throw err;
      }

      newStats.users.numberSignedUp = users.length;

      async.each(users, function (user, callback) {
        //////////////////////////////////////////////////////////////
        // begin: calulate users stats (except total users, that's above)
        //////////////////////////////////////////////////////////////
        newStats.users.numberVerified += user.verified ? 1 : 0;
        newStats.users.numberCompletedRegistration += user.status.completedProfile ? 1 : 0;
        newStats.users.numberCheckedin += user.status.checkedIn ? 1 : 0;
        newStats.users.numberPreviouslyAttendedHackathons += user.profile.previouslyAttended ? 1 : 0;
        //////////////////////////////////////////////////////////////
        // end: calulate users stats
        //////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////
        // begin: calulate teams stats
        //////////////////////////////////////////////////////////////
        newStats.teams.numberTeams += user.teamCode ? 1 : 0;
        newStats.teams.numberUsersWithoutTeams += user.teamCode ? 0 : 1;
        //newStats.teams.numberTeamsOneUser
        //newStats.teams.averageTeamSize
        //////////////////////////////////////////////////////////////
        // end: calulate teams stats
        //////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////
        // begin: calulate swag stats
        //////////////////////////////////////////////////////////////
        newStats.swag.shirtSizes[user.profile.shirtSize] += 1;
        //////////////////////////////////////////////////////////////
        // end: calulate swag stats
        //////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////
        // begin: calulate hardware stats
        //////////////////////////////////////////////////////////////
        newStats.hardware.numberUsersRequestingFireeyeHardware += user.profile.wantsFireeyeHardware ? 1 : 0;
        newStats.hardware.numberUsersRequestingThirdpartyHardware += user.profile.wantsThirdpartyHardware ? 1 : 0;
        //////////////////////////////////////////////////////////////
        // end: calulate hardware stats
        //////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////
        // begin: calulate hardware stats
        //////////////////////////////////////////////////////////////
        newStats.software.numberUsersRequestingFireeyeSoftware += user.profile.wantsFireeyeSoftware ? 1 : 0;
        newStats.software.numberUsersRequestingThirdpartySoftware += user.profile.wantsThirdpartySoftware ? 1 : 0;
        //////////////////////////////////////////////////////////////
        // end: calulate hardware stats
        //////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////
        // begin: calulate location stats
        //////////////////////////////////////////////////////////////
        let location = newStats.locations.find(location => { return location.name === user.profile.location });
        if (location) {
          // increment the stuff
          newStats.locations.map(location => {
            if (location.name === user.profile.location) {
              location.numberCompletedRegistration += user.status.completedProfile ? 1 : 0
              location.numberFoodAllergies += user.profile.hasFoodAllergies ? 1 : 0
              location.numberDietaryRestrictions += user.profile.hasDietaryRestriction ? 1 : 0
              location.numberNeedingHardware += (user.profile.wantsFireeyeHardware || user.profile.wantsThirdpartyHardware) ? 1 : 0
              location.numberNeedingSoftware += (user.profile.wantsFireeyeSoftware || user.profile.wantsThirdpartySoftware) ? 1 : 0
              location.shirtSizes[user.profile.shirtSize] += 1;
            }

            return location;
          });
        }
        else {
          if (user.profile && user.profile.location) {
            // create the object with this users starting values

            location = {
              name: user.profile.location,
              numberCompletedRegistration: user.status.completedProfile ? 1 : 0,
              shirtSizes: {
                'XS': 0,
                'S': 0,
                'M': 0,
                'L': 0,
                'XL': 0,
                'XXL': 0,
                'WXS': 0,
                'WS': 0,
                'WM': 0,
                'WL': 0,
                'WXL': 0,
                'WXXL': 0,
                'None': 0
              },
              numberFoodAllergies: user.profile.hasFoodAllergies ? 1 : 0,
              numberDietaryRestrictions: user.profile.hasDietaryRestriction ? 1 : 0,
              numberNeedingHardware: (user.profile.wantsFireeyeHardware || user.profile.wantsThirdpartyHardware) ? 1 : 0,
              numberNeedingSoftware: (user.profile.wantsFireeyeSoftware || user.profile.wantsThirdpartySoftware) ? 1 : 0
            }

            if (user.profile.shirtSizes) {
              location.shirtSizes[user.profile.shirtSize] = 1;
            }

            newStats.locations.push(location);
          }
        }
        //////////////////////////////////////////////////////////////
        // end: calulate location stats
        //////////////////////////////////////////////////////////////


        console.log('Stats updated!');
        newStats.lastUpdated = new Date();
        stats = newStats;
      });
    });
}

// Calculate once every five minutes.
calculateStats();
setInterval(calculateStats, 10000);

var Stats = {};

Stats.getUserStats = function () {
  return stats;
};

module.exports = Stats;
