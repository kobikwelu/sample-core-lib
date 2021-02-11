const path = require('path');
var fs = require('fs');
var shelljs = require('shelljs');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var temp,status;
var basedir = './target/screenshots/';
var count = 1;
module.exports = {
  take: function(desc) {
    if(desc == undefined){
      desc='noDescriptionGiven'
    }
    currentTest = this.test.title;
    currentParent = this.test.parent.title;
    
    if(temp !==currentTest){
      count = 1;
    }
    shelljs.mkdir('-p' ,path.join(basedir,currentParent,currentTest));
    driver = this.driver;
      
      return driver.takeScreenshot().then(function(image){
        var filename =path.join((basedir+currentParent),currentTest,currentTest+'.step'+count+'.'+desc+'.png');
        count = count + 1;
        fs.writeFile(filename, image, 'base64' );
        temp = currentTest;
      });
  },
  startTest : function (driver,test){
    this.driver = driver;
    this.test = test;
  }
};