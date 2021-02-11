
'use strict';
/**
 * dataReader methods to be used by various projects to read JSON data files/tables. The main use of these files is to pull users for tests.
 * @module commonMethods
 * @main dataReader
 * @class dataReader
 */

var _ = require('underscore-node');

/**
* dataReader class helps read data from JSON files/tables. Mainly planned to be used for user data propogation but will be flexible enough to read any json data.
* @class dataReader
*/
module.exports = {
  /**
   * Filters users in the JSON file by any desired configuration
   * @method filterUsers
   * @return json array
   * @param allUsers - The full list of users in json format
   * @param conditions - Filter users by "tags" as well as "key : value" pair
   * <code>filterUsers(allUsers, "tag1,tag2,tag3", [&#123;"key1":"value1"&#125;,&#123;"key2":"value2"&#125;])</code>
   */
  filterUsers:function(allUsers){

var i;
    for (i = 1; i < arguments.length; i++) {
      if (typeof arguments[i] == 'string'){
        var byTags = arguments[i]
      }
      if (typeof arguments[i] == 'object'){
        var byGroups = arguments[i]
      }
    }

    if (byGroups == undefined && byTags == undefined){
        console.log('parameter passed in has issues')
    }
    //console.log(Object.keys(byGroups[0]));
    var filteredByGroup= [];
    var filteredByTag=[];

    if (byGroups != undefined){
      filteredByGroup= _.where(allUsers, byGroups);
    }
    //console.log(filteredByGroup)
    if (byTags != undefined){

      var inputTags = byTags.split(',');
      allUsers.filter(function(user){
        if (user['tags'] != undefined){
          if (user['tags'].filter(function (elem) {
                            return inputTags.indexOf(elem) > -1;
                          }).length == inputTags.length){
            filteredByTag.push(user);
          }
        }
      })  
    }
    //console.log(filteredByTag)
    if (byTags != undefined && byGroups != undefined){
      var filteredUsers = _.intersection(filteredByTag,filteredByGroup);
    }
    if (byTags != undefined && byGroups == undefined){
      var filteredUsers = filteredByTag;
    }
    if (byTags == undefined && byGroups != undefined){
      var filteredUsers = filteredByGroup;
    }
    //console.log(filteredUsers)
    return filteredUsers;
  }
};

