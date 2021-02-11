//var Allure = require('mocha-allure-reporter');
//global.allure = new Allure();
var env = require('./env');
var screenshot = require('./screenshot.js')
/**
 * Reporting library (Allure) that is being utilized inside our KP framework
 * @class allureReporter
 * @main reporting
 * @module reporting
 */
module.exports = {

  /**
   * Add a userstory to your test
   * @method addStory
   * @param story - the name/id of the userstory you want to add.
   */
  addStory: function(story) {
    allure.description(story);
  },

  /**
   * Takes a screenshot of the page for the allure report.
   * @method takeScreenshot
   * @param scDes - name of the screenshot
   * @param scrollToElement - _optional_; webelement to scroll to and center when taking image
   */
  takeScreenshot: function(scDes, scrollToElement) {
    if (scrollToElement != undefined) {
      return env.driver().executeScript('arguments[0].scrollIntoView()', scrollToElement).then(function() {
        screenshot.take(scDes.replace(/\//gi,"_"));
      });
    } else {
      return screenshot.take(scDes.replace(/\//gi,"_"));
    }
  }

}