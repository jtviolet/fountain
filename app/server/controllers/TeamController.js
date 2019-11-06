var _ = require('underscore');
var User = require('../models/User');

var TeamController = {};


/**
 * Get all teams.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
TeamController.getAll = function (callback) {
  User.find({}, 'teamCode isTeamLeader name', (err, users) => {
    if (err) {
      callback(err);
    } else {
      let teams = new Map();
      const res = {
        teams: []
      }
      users.data.array.forEach(user => {
        if (teams.has(user.teamCode)) {
          teams.set(user.teamCode, {
            members: teams.get(user.teamCode).members.push(user.name),
            leader: user.isTeamLeader ? user.name : undefined 
          });
        } else {
          teams.set(user.teamCode, { 
            members: [user.name],
            leader: user.isTeamLeader ? user.name : undefined 
          });
        }
      });
      teams.forEach((value, key) => {
        res.teams.push({
          name: key,
          members: value.members,
          leader: value.leader
        });
      });
      callback(res);
    }
  });
};

/**
 * Get a page of users.
 * @param  {[type]}   page     page number
 * @param  {[type]}   size     size of the page
 * @param  {Function} callback args(err, {users, page, totalPages})
 */
/*
TeamController.getPage = function(query, callback){
  var page = query.page;
  var size = parseInt(query.size);
  var searchText = query.text;

  var findQuery = {};
  if (searchText.length > 0){
    var queries = [];
    var re = new RegExp(searchText, 'i');
    queries.push({ email: re });
    queries.push({ 'profile.name': re });
    queries.push({ 'teamCode': re });

    findQuery.$or = queries;
  }

  User
    .find(findQuery)
    .sort({
      'profile.name': 'asc'
    })
    .select('+status.admittedBy')
    .skip(page * size)
    .limit(size)
    .exec(function (err, users){
      if (err || !users){
        return callback(err);
      }

      User.count(findQuery).exec(function(err, count){

        if (err){
          return callback(err);
        }

        return callback(null, {
          users: users,
          page: page,
          size: size,
          totalPages: Math.ceil(count / size)
        });
      });

    });
};
*/

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
