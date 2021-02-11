/**
 * Core methods are the base of the framework and handle creating the necessary test environment. Including, but not limited to, driver intialization
 * @class env
 * @main core
 * @module core
 */
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');

var shelljs = require('shelljs');
var fs = require('fs');
var path = require('path');

var where = process.env['ENVIRONMENT'];
var browser = process.env['BROWSER'];
var platform = process.env['PLATFORM'];
var width = process.env['BROWSER_WIDTH'];
var height = process.env['BROWSER_HEIGHT'];
var seleniumtimeout = process.env['SELENIUMTIMEOUT'];

var capabilities = require('../data/capabilities.json');
var users = require('./users');
var screenshot = require('./screenshot');

var driver;

var chai = require('chai'); 
var chaiAsPromised = require('chai-as-promised'); 
var basedir = './target/screenshots/';

chai.use(chaiAsPromised); 
chai.config.truncateThreshold = 0;

global.webdriver = webdriver; 
global.chaiAsPromised = chaiAsPromised; 
global.expect = chai.expect;
global.test = test;

if (isNaN(seleniumtimeout)) {
  seleniumtimeout = 5000;
}
seleniumtimeout = parseInt(seleniumtimeout);


function regionPicker() {
  var regions = process.env['REGIONS'];
  if (regions.toLowerCase() == 'all') {
    return ['NCAL', 'SCAL', 'MAS', 'COL', 'HAW', 'KNW', 'GGA']
  } else {
    return process.env['REGIONS'].split(',')
  }
}

var regions = regionPicker();

module.exports = {
  /**
   * An array object the regions that were passed to the test run
   * These can be read during execution for easy data looping
   *
   * @default ALL, ['NCAL', 'SCAL', 'MAS', 'COL', 'HAW', 'KNW', 'GGA']
   * @attribute regions
   * @readOnly
   * @type object
   */
  regions: regions,

  /**
   * The environment that was passed to the test run. These can be read during execution for easy data looping
   *
   * @attribute where
   * @readOnly
   * @type string
   */
  where: where,

  /**
   * The timeout in milliseconds (ms) for all selenium methods as read when passed to test run
   *
   * @attribute seleniumtimeout
   * @readOnly
   * @default 15000
   * @type int
   */
  seleniumtimeout: seleniumtimeout,

  // Not adding any notes to users since I don't hink we need this here. lib/users.js is already exported as dataReader
  users: users,

  /**
   * The platform to test on that was passed to the test run
   *
   * @attribute platform
   * @readOnly
   * @default desktop
   * @type string
   */
  platform: platform,

  /**
   * Returns an instance of the (remote) webdriver to the user
   * @method driver
   * @returns {RemoteWebDriver} driver
   */
  driver: function () {
    return driver;
  }
};

test.before(function () {
  platform === 'mobile' ? openMobileBrowser() : openDesktopBrowser();
  shelljs.rm('-rf', basedir);
});

test.beforeEach(function () {
  var currentTestName = this.currentTest.title;
  shelljs.mkdir('-p', path.join(basedir, this.currentTest.parent.title, this.currentTest.title));
  console.log(currentTestName, ': Execution Starts ...');
  //driver.manage().deleteAllCookies();
  screenshot.startTest(driver, this.currentTest);
});

test.afterEach(function () {  
  var currentTestName = this.currentTest.title;
  //driver.manage().deleteAllCookies();  

  if (this.currentTest.state === 'failed') {
    console.log('Execution Status  -  ', this.currentTest.state.red, '\n');
    screenshot.take('Test Failed', 'fail');
  }
  if (this.currentTest.state === 'passed') {
    console.log('Execution Status  -  ', this.currentTest.state.green, '\n');
    screenshot.take('Test Passed');
  }
});

test.after(function () {
  driver.quit();
});

/**
 * Opens a desktop browser for the test. Browser will be opened on the local machine or the Selenium Grids we use
 * @method openDesktopBrowser
 * @module core
 * @private
 */
function openDesktopBrowser() {
  if (capabilities[browser] && capabilities[browser]['host']) {
    console.log("opening remote webdriver on " + capabilities[browser]['host']);
    driver = new webdriver.Builder()
      .usingServer(capabilities[browser]['host'])
      .withCapabilities(capabilities[browser]['browserCapabilities'])
      .build();
  } else {
    driver = new webdriver.Builder()
      .withCapabilities(capabilities[browser])
      .build();
  }
  // driver.manage().deleteAllCookies();
  if (isNaN(width) || isNaN(height)) {
    driver.manage().window().maximize();
  } else {
    driver.manage().window().setSize(parseInt(width), parseInt(height));
  }
  driver.manage().timeouts().implicitlyWait(seleniumtimeout);
}

/**
 * Opens a mobile browser for the test using Perfecto connections
 * @method openMobileBrowser
 * @module core
 * @private
 */
function openMobileBrowser() {
  var perfectoCapabilities = {
    browserName: 'mobileOS',
    deviceName: process.env['DEVICE_ID'],
    user: process.env['PERFECTO_USERNAME'],
    password: process.env['PERFECTO_PASSWORD'],
    platformName: process.env['MOBILE_OS']
  };
  driver = new webdriver.Builder()
    .usingServer(capabilities['perfecto'][process.env["LOCATION"]])
    .withCapabilities(perfectoCapabilities)
    .build();
  // driver.manage().deleteAllCookies();
  driver.manage().timeouts().implicitlyWait(seleniumtimeout);
}