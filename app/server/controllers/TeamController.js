var _ = require('underscore');
var User = require('../models/User');

var TeamController = {};


/**
 * Get all teams.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
TeamController.getAll = function (callback) {
  User.find({}, 'teamCode profile.name', (err, users) => {
    if (err) {
      callback(err);
    } else {
      let teams = new Map();
      const res = {
        teams: []
      }
      users.forEach(user => {
        if (user.teamCode) {
          if (teams.has(user.teamCode)) {
            teams.set(user.teamCode, {
              members: teams.get(user.teamCode).members.concat([user.profile.name])
            });
          } else {
            teams.set(user.teamCode, { 
              members: [user.profile.name]
            });
          }
        }
      });
      teams.forEach((value, key) => {
        res.teams.push({
          name: key,
          members: value.members
        });
      });
      callback(null, res);
    }
  });
};

/**
 * Get a page of users.
 * @param  {[type]}   page     page number
 * @param  {[type]}   size     size of the page
 * @param  {Function} callback args(err, {users, page, totalPages})
 */

TeamController.getPage = function(query, callback){
  var page = query.page;
  var size = parseInt(query.size);
  var searchText = query.text;

  var findQuery = {};
  if (searchText.length > 0){
    var queries = [];
    var re = new RegExp(searchText, 'i');
    queries.push({ 'teamCode': re });

    findQuery.$or = queries;
  }

  User
    .find(findQuery)
    .sort({
      'teamCode': 'asc'
    })
    .select('teamCode profile.name')
    .skip(page * size)
    .limit(size)
    .exec(function (err, users){
      if (err || !users){
        return callback(err);
      }

      let teams = new Map();
      const res = {
        teams: []
      }
      users.forEach(user => {
        if (user.teamCode) {
          if (teams.has(user.teamCode)) {
            teams.set(user.teamCode, {
              members: teams.get(user.teamCode).members.concat([user.profile.name])
            });
          } else {
            teams.set(user.teamCode, { 
              members: [user.profile.name]
            });
          }
        }
      });
      teams.forEach((value, key) => {
        res.teams.push({
          name: key,
          members: value.members
        });
      });

      User.distinct('teamCode', function(err, distinctTeams) {

        if (err){
          return callback(err);
        }

        return callback(null, {
          teams: res.teams,
          page: page,
          size: size,
          totalPages: Math.ceil(distinctTeams.length / size)
        });
      });
    });
};

/**
 * Get a user by id.
 * @param  {String}   id       User id
 * @param  {Function} callback args(err, user)
 */
/*
TeamController.getById = function (id, callback){
  User.findById(id).exec(callback);
};
*/

module.exports = TeamController;
