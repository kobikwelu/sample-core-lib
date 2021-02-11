/**
 * Wrapper for performing LDAP actions
 * @class ldapUtils
 * @module utils
 */
var java = require('java'),
  test = require('selenium-webdriver/testing'),
  ldapConfig = require('../data/ldapConfig.json'),
  env = require('./env'),
  shell = require('shelljs'),
  interrupts = require('./api/interrupts');

java.options.push("-Djava.awt.headless=true");

if (!shell.test('-d', './node_modules/kp-webdriverjs-utils/')) {
    java.classpath.push(process.cwd() + '/jar/kp-webdriver-ldap-utils.jar');
} else {
    java.classpath.push(process.cwd() + '/node_modules/kp-webdriverjs-utils/jar/kp-webdriver-ldap-utils.jar');
}

var ldapEnv = (env.where).toLowerCase();
/**
 * Select value from drop down
 * @param guid :  GUID for member
 * @param key :  Colomn you would like to verify or modify
 * @param value :  value you would like to modify text to
 * @param userId :  userID of the member's data you would like to access
 * @param actionType :  action you need to do in ldap ex:'modify' or 'search'
 * @method performLdapAction
 */
module.exports = {
    performLdapAction: function(actionType, guid, userId, key, value) {
        var ldapConnectString = ldapConfig[ldapEnv].host;
        var ldapUtil = java.newInstanceSync('lib.ldapSource.ldapUtil', ldapConnectString, ldapConfig[ldapEnv].user, ldapConfig[ldapEnv].password);

        if (actionType === 'modify') {
          /*
            var configDn = ldapConfig[ldapEnv].DN.replace('temp', guid.substr(guid.length - 1, 1));
            console.log(configDn);
            dn = 'guid=' + guid + ',' + configDn;
            ldapUtil.setLDAPDirContextSync();
            return ldapUtil.modifyLdapSync(dn, key, value);
          */

          interrupts.modifyLdapAttribute(guid, 'update', key, value, (res,body) => {
            console.log(res);
            return body;
          })

        } else if (actionType === 'search') {
            ldapUtil.setLDAPDirContextSync();
            return ldapUtil.setLDAPSearchInMapSync(ldapUtil.searchLdapSync(userId), key)
        }
    }
}