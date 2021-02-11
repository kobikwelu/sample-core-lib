/**
 * Common methods to be used by various projects. Most of these will be for making assertions or navigating kp.org. Additionally there will be common methods for very common fuctions and behaviours, such as signing on to the site.
 * @module commonMethods
 * @main commonMethods
 */

'use strict';

var env = require('./env'),
  webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By,
  by = webdriver.By,
  until = require('selenium-webdriver').until,
  expect = require('chai').expect,
  assert = require('chai').assert,
  _ = require('underscore-node'),
  locator = require('../locators.json').landing,
  baseEnv = require('../data/capabilities').baseUrl,
  where = process.env['ENVIRONMENT'] || 'dev1',
  screenshot = require('./screenshot'),
  allure = require('./allureReporter'),
  dbUtil = require('./dbUtils');


/**
 * Helper methods used to achieve common functionality such as navigating the site and grabbing attributes from webelements
 * @class helper
 */
module.exports = {
  /**
   * Help make selection on proxy picker.
   * @method proxyPicker
   * @param name - The proxy name you would like to select
   * @param rwd - OPTIONAL if something is passed in it will run for rwd proxy picker locators
   */
  selectProxyByName: function(name, rwd) {
    var locators = {};
    if (rwd) {
      locators = {
        mainProxySection: {
          "css": "#selectProxy"
        },
        proxySectionOption: {
          "css": "#selectProxy option"
        },
        proxySelection: {
          "xpath": "//*[@id='selectProxy']/option[contains(text(),'" + name + "')]"
        }
      }
    } else {
      locators = {
        mainProxySection: {
          "css": "#proxy-members #proxy-picker-select-dropdown"
        },
        proxySectionOption: {
          "css": "#proxy-members #proxy-picker-select-dropdown option"
        },
        proxySelection: {
          "xpath": "//*[@id='proxy-picker-select-dropdown']/option[contains(text(),'" + name + "')]"
        }
      }
    }
    env.driver().wait(function() {
      return env.driver().wait(until.elementLocated(locators.mainProxySection), env.seleniumtimeout);
    }, 20);
    return env.driver().findElement(locators.mainProxySection).click().then(function(res) {
      console.log('selectProxyByName name:', name);
      env.driver().findElements(locators.proxySectionOption).then(function(ele) {
        var totalUsers = ele.length;
        var count = 0;
        _.each(ele, function(el) {
          el.getText().then(function(proxyname) {
            if (proxyname.toLowerCase().trim() == name.toLowerCase()) {
              env.driver().findElement(locators.proxySelection).click().then(function() {
                env.driver().findElement(locators.mainProxySection).getText().then(function(changedProxy) {
                  screenshot.take('proxy name : ' + name);
                });
              });
            } else if (count == totalUsers) {
              assert.equal('proxy user found', 'Did not find proxy user');
            } else {
              count++;
            }
          });
        });
      });
    });
  },

  /**
   * Help make selection on region picker.
   * @method regionPicker
   * @param option - The region you would like to select, if no parameter passed it will press cancel.
   *                 Use the CMS content acronym for region ex: (MRN,MID,SCA,HAW,GGA,KNW,DB,CS)
   */
  regionPicker: function(option) {
    var regionModal = {
      cancelButton: by.css('#region-modal-button-cancel'),
      continueButton: by.css('#region-modal-button-continue'),
      midAtlanticRadioButton: by.css('#region-code-MID'),
      northwestRadioButton: by.css('#region-code-KNW'),
      ncalRadioButton: by.css('#region-code-MRN'),
      scalRadioButton: by.css('#region-code-SCA'),
      scolRadioButton: by.css('#region-code-CS'),
      georgiaRadioButton: by.css('#region-code-GGA'),
      hawaiiRadioButton: by.css('#region-code-HAW'),
      denverBoulderRadioButton: by.css('#region-code-DB')
    };
    this.waitUntilVisible([regionModal.cancelButton]);
    option = option.toUpperCase();
    switch (option) {
      case "MRN":
        // ncal block
        env.driver().findElement(regionModal.ncalRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "MID":
        // mid atlantic block
        env.driver().findElement(regionModal.midAtlanticRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "SCA":
        // scal block
        env.driver().findElement(regionModal.scalRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "HAW":
        // hawaii block
        env.driver().findElement(regionModal.hawaiiRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "GGA":
        // georgia block
        env.driver().findElement(regionModal.georgiaRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "KNW":
        // northwest block
        env.driver().findElement(regionModal.northwestRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "DB":
        // colorado denver boulder block
        env.driver().findElement(regionModal.denverBoulderRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      case "CS":
        // colorado south block
        env.driver().findElement(regionModal.scolRadioButton).click();
        env.driver().findElement(regionModal.continueButton).click();
        break;
      default:
        env.driver().findElement(regionModal.cancelButton).click();
    }
  },

  /**
   * Redirects user to their desired destination and modifies it to the environment from driverconfig
   * @method redirectUrl
   * @param url - the destination url that we wish to navigte to, must follow a standard https://env.kaiserpernanete.org or https://espanol-env.kaiserpernanete.org pattern<br>
   * <code>https://dev20.kaiserpermanente.org/new-members/register-to-kp</code>
   * <code>https://espanol-dev20.kaiserpermanente.org/new-members/register-to-kp</code>
   */
  redirectUrl: function(url) {
    var reUrl
    if (url.substring(url.search("//"), url.search(".kaiser")).includes('espanol')) {
      console.log('spanish link');
      reUrl = url.substring(0, url.search("//")) + "//espanol-" + where + url.substring(url.search(".kaiser"));
    } else {
      console.log('english link');
      reUrl = url.substring(0, url.search("//")) + "//" + where + url.substring(url.search(".kaiser"));
    }

    var redirectPromise = env.driver().get(reUrl);
    redirectPromise.then(function() {
      console.log("Launched ", reUrl, " Successfully ");
    }, function(error) {
      console.log('uh error', error);
    });
  },

  /**
   * Waits until the selectors passed are visible (ready) on the page.
   * @method waitUntilVisible
   * @param selectors - List of selectors to be checked in the page  ex: username: by.css('[name=username]')
   * @param message - Optional error message to display if element is not found.
   */
  waitUntilVisible: function(selectors, message) {
    selectors.forEach(function(selector) {
      env.driver().wait(until.elementLocated(selector), env.seleniumtimeout).then(function(webElement) {
        webElement.isDisplayed().then(function(result) {
          if (result == false) {
            screenshot.take("cant View element");
          } else {
            assert.isTrue(result, "can View element");
          }
        });
      }, function(err) {
        if (err.name && err.name === 'Error') {
          screenshot.take('Cant find element - Timeout');
          if (message === null || message === undefined) {
            assert.isTrue(false, selector + ' Cant find element - Timeout');
          } else {
            assert.isTrue(false, message);
          }
        } else {
          webdriver.promise.rejected(err);
        }
      });
    });
    // allure.takeScreenshot("Capture Screen Shot - page/element refresh/visible");
  },

  /**
   * Verify if the title of the page is as given in expected value
   * @param expectedTitle - The title to be verified
   * @method verifyTitle
   */
  verifyTitle: function(expectedTitle) {
    env.driver().getTitle().then(function(actualTitle) {
      expect(actualTitle.toLowerCase().trim()).to.contain(expectedTitle.toLowerCase().trim());
      screenshot.take('Page opened successfully');
    }, function(error) {
      console.log('uh error', error);
    });
  },

  /**
   * Clicks on the radio button and returns the status of selection
   * @param locator - webelement to be clicked
   * @method clickRadioButton
   */
  clickRadioButton: function(locator) {
    env.driver().wait(until.elementLocated(locator), env.seleniumtimeout);
    env.driver().findElement(locator).click();
    return env.driver().findElement(locator).isSelected().then(function(selected) {
      //   return selected;
      expect(selected).to.be.true;
    }, function(error) {
      console.log('The error is :', error);
      assert.isTrue(false);
    });
  },

  /**
   * Get the text value from the element
   * @param locator - webelement where to fetch Text
   * @method getTextValue
   * @return text value from locator
   */
  getTextValue: function(locator) {
    env.driver().wait(until.elementLocated(locator), env.seleniumtimeout);
    return env.driver().findElement(locator).getText().then(function(actualvalue) {
      return actualvalue;
    }, function(error) {
      console.log('The error is :', error);
    });
  },

  /**
   * Select value from drop down that contains the desired text
   * @param selector :  Webelement of the drop down (locator)
   * @param item :  item to be fetched from drop down (string)
   * @method selectOptionFromDropDown
   */
  selectOptionFromDropDown: function(selector, item) {
    var valueToPick;
    var dropDownValues = env.driver().findElement(selector);
    dropDownValues.findElements(By.tagName('option'))
      .then(function findMatchingOption(options) {
        options.some(function(option) {
          option.getAttribute('label')
            .then(function doesOptionMatch(text) {
              if (text.toUpperCase().includes(item.toUpperCase())) {
                valueToPick = option;
                return true;
              }
            });
        });
      })
      .then(function clickOption() {
        if (valueToPick) {
          var actionSequence = new webdriver.ActionSequence(env.driver());
          return actionSequence.mouseMove(valueToPick).click(valueToPick).perform();
        }
      });
  },

  /**
   * Gets the text list for the element that was passed
   * @method getTextListFor
   * @param locator - the element(s) we are grabbing the text of.
   * @return text from locator
   */
  getTextListFor: function(locator) {
    return env.driver().findElements(locator).then(function(elements) {
      var textPromises = elements.map(function(e) {
        return e.getText();
      });
      return webdriver.promise.all(textPromises).then(function(text) {
        return text;
      });
    });
  },

  /**
   * Waits till the loading icon goes away.  loading icon goes away after the page load is fully loaded
   * @method waitUntilLoadingCompleted
   */
  waitUntilLoadingCompleted: function() {
    env.driver().wait(function() {
      return env.driver().findElement(By.css(locator.loadingIcon)).isDisplayed().then(function(displayed) {
        return displayed === false;
      });
    }, env.seleniumtimeout);
  },

  /**
   * This function will return today's date
   * @method returnTodaysDateAsString
   * @return the date
   */
  returnTodaysDateAsString: function() {
    var today = new Date();
    var todayFormatted = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
    return todayFormatted;
  },

  /**
   * Verifies that element is not availble in the DOM, and asserts against it. This method can create a lot of overhead due to seraching the full DOM
   * @param elementLocator :  Webelement to be searched
   * @method assertIsNotPresent
   * @return arrayValue - returns the array list of found elements (if any)
   */
  assertIsNotPresent: function(elementLocator) {
    var driver = env.driver();
    driver.findElements(elementLocator).then(function(arrayValue) {
      expect(arrayValue.length).to.equal(0);
      return arrayValue;
    });
  },

  /**
   * Verify that an element that is present in the DOM and is not visible in page
   * @param elementLocator : Webelement to search for
   * @method assertNotDisplayed
   */
  assertNotDisplayed: function(elementLocator) {
    var driver = env.driver();
    driver.findElement(elementLocator).isDisplayed().then(function(isDisplayed) {
      expect(isDisplayed).to.be.false;
    });
  },

  /**
   * Verify that an element that is visible in page
   * @param elementLocator : Webelement to search for
   * @method assertIsDisplayed
   */
  assertIsDisplayed: function(elementLocator) {
    var driver = env.driver();
    driver.findElement(elementLocator).isDisplayed().then(function(isDisplayed) {
      expect(isDisplayed, "Desired Element" + elementLocator + "should have been displayed").to.be.true;
    });
  },

  /**
   * Selects a radio button from the list of radio button
   * @param selector - Webelement where the list of buttons exist
   * @param myOption - The radio button to be clicked from the list
   * @method selectRadioOption
   */
  selectRadioOption: function(selector, myOption) {
    var optionsList = driver.findElements(selector);
    optionsList.then(function(options) {
      options.forEach(function(option) {
        option.getText().then(function(actualOption) {
          if (actualOption.indexOf(myOption) > -1) {
            return option.click();
          }
        });
      });
    });
  },
  /**
   * Verify if the Url of the page is equal to the expected value
   * @param expectedUrl : The url to be verified
   * @method verifyUrl
   */
    verifyUrl: function(url) {
    env.driver().getCurrentUrl().then(function(currentUrl) {      
      var expectedUrl = url.replace(/env/g, env.where);      
      expect(currentUrl).to.equal(expectedUrl);    
    });
  },
  /**
   * Verify if the Url of the page contains to the expected value
   * @param expectedText : The expected text in url to be verified
   * @method verifyUrlContains
   */
    verifyUrlContains: function(expectedText) {
    env.driver().getCurrentUrl().then(function(currentUrl) {      
      expect(currentUrl.toLowerCase()).to.contain(expectedText.toLowerCase());    
    });
  },

  /**
   * Looks up guid for the respective mrns that are passed to it
   * @param mrns - an array of mrns to be parsed to return a guid.
   * @method mrnToGuidParser
   * @return - returns an array of json objects containing respective guids, <code>[ { GUID: '100010138' },{ GUID: '100022042' },{ GUID: '100011853' } ]</code>
   */
  mrnToGuidParser: function(mrns) {
    var results = [];
    mrns.forEach(function(currentMrn, index) {
      results.push(JSON.parse(dbUtil.mrnToGuid(currentMrn)));
      expect(results[index].GUID, "GUID should exist in response").to.exist;
    });
    return results;
  }
}
