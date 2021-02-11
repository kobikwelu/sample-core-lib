'use strict';
var env = require('../../lib/env');
var until = require('selenium-webdriver').until;
var where = process.env['ENVIRONMENT'] || 'dev1';
var by = webdriver.By;
var baseEnv = require('../../data/environments').baseUrl;
var helper = require('../../lib/helper');
var screenshot = require('../../lib/screenshot');

var _ = require('underscore-node');
var assert = require('chai').assert;


/**
 * Creates the sign on page and cotains __kpSignOn__ method
 * @class signOn
 * @module commonMethods
 */
module.exports = function(driver) {

  var signOn = {
    username: by.css('[name=username]'),
    password: by.css('[name=password]'),
    signonForm: by.css('#signonform'),
    signOnHeaderForm: by.css('#signonheaderform'),
    signonButton: by.css('[name=signonButton]'),
    logoffMessage: by.css('#disErrorPageMessage')
  };

  return {
    verifyPage: function(type) {
      if ((type === 'home')) {
        helper.waitUntilVisible([
          signOn.username,
          signOn.password,
          signOn.signOnHeaderForm
        ]);
      } else {
        helper.waitUntilVisible([
          signOn.username,
          signOn.password,
          signOn.signonForm
        ]);
      }
    },

    verifyLogoff: function() {
      helper.waitUntilVisible([
        signOn.logoffMessage
      ], "Log off confirmation text not found");
    },

    kpSignOff: function(type) {
      var _this = this;
      var logoffurl;
      if (_.contains(['contextual', 'home', 'logoff'], type)) {
        logoffurl = baseEnv[type].replace('env', where);
      } else if (type.includes('https://')) {
        logoffurl = type.substring(0, type.search("//")) + "//" + where + type.substring(type.search(".kaiser"));
      } else {
        assert.isTrue(false, 'logoff url can not be generated');
      };
      driver.get(logoffurl).then(function() {
        _this.verifyLogoff();
      }, function(err) {
        assert.isTrue(false, 'Log off failed')
      });
    },

    /**
     * Logs user onto KP.org with necessary credentials
     * @param credentials - the user ID and password for log on
     * @param type - the type of sign on being used. If using url*s make sure url needs to contain "http://" in the starting
     * and ".kaiser" after the environment ex: "https://env.kaiserpermanente.org/coverage-costs.html"; <code>home, contextual, url*</code>
     * @method kpSignOn
     * @return void
     */
    kpSignOn: function(credentials, type) {
      //, signOnEnv, url
      var signOnUrl;
      if (_.contains(['contextual', 'home'], type)) {
        signOnUrl = baseEnv[type].replace('env', where);
      } else if (type.includes('https://')) {
        signOnUrl = type.substring(0, type.search("//")) + "//" + where + type.substring(type.search(".kaiser"));
      } else {
        assert.isTrue(false, 'sign-on url can not be generated');
      };
      console.log(signOnUrl);
      var username = credentials.username;
      var password = credentials.password;
      console.log("username is: " + username);
      expect(signOnUrl).to.exist;
      expect(username).to.exist;
      expect(password).to.exist;
      if (signOnUrl) {
        driver.get(signOnUrl);
        if ((type === 'home')) {
          var signonForm = driver.findElement(signOn.signOnHeaderForm);
        } else {
          var signonForm = driver.findElement(signOn.signonForm);
        }
        this.verifyPage(type);
        driver.findElement(signOn.username).clear();
        driver.findElement(signOn.password).clear();
        driver.findElement(signOn.username).sendKeys(username);
        driver.findElement(signOn.password).sendKeys(password);
        driver.findElement(signOn.signonButton).click().then(function() {
          driver.wait(until.stalenessOf(signonForm), env.seleniumtimeout);
        }, function(err) {
          console.log("signonForm wait timeOut after: ", env.seleniumtimeout)
          assert.isTrue(false, 'sign on failed')
        });
      }
    }
  }
}