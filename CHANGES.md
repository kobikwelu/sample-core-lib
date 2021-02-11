# Change Log
All notable changes to this project will be documented in this file. We are planning on release Major and Minor versions only. Patch versions will be used as needed. Major versions will most likely NOT be 100% backwards compatible, minor versions should be 100% backwards compatible within that version, and patches are hotfixes for the last released version.
>Versioning breakdown: MAJOR.MINOR.PATCH, e.g. 2.1.3, Major = 2, Minor = 1, Patch = 3

>2.x minor versions should be backwards compatible within 2.x, e.g. 2.2 should work with 2.1 and 2.0.

## [Unreleased]

## [5.0.2] - 2018 September 24
### Fixed
- [PQEAUTO-511](https://jira-fof.appl.kp.org/browse/PQEAUTO-511) Correcting the credentials for HINT1 (oracle) DB

## [5.0.1] - 2018 July 30
### Fixed
- [PQEAUTO-439](https://jira-fof.appl.kp.org/browse/PQEAUTO-439) Correcting `createTermsAndConditions` name in yuidocs and changing create secret questions to type `POST` instead of `PUT`. Adding notes regarding work done to change log.

## [5.0] - 2018 July 2
### Added
- [PQEAUTO-340](https://jira-fof.appl.kp.org/browse/PQEAUTO-340) [PQJS-193](https://jira.kp.org/browse/PQJS-193) Adding Javadoc annotating to `lib/env.js` so that teams can easily see what attributes are exported by the lib's base class.

### Removed
- [PQJS-239](https://jira.kp.org/browse/PQJS-239) Removing unused methods from our go (Homebrew, python, allure cli checks and installs)

### Changed
- [PQJS-1](https://jira.kp.org/browse/PQJS-1) [PQEAUTO-336]](https://jira-fof.appl.kp.org/browse/PQEAUTO-336) **BREAKING** Updating to Selenium 3.x
    + Node >=6 is now required
- [PQEAUTO-337](https://jira-fof.appl.kp.org/browse/PQEAUTO-337) Changed how we install grunt peer dependency again. Also, this issue with grunt brings back to light the fact that NPM 5.0.0 - 6.0.1 will prune dependencies it thinks are not needed (hence why this code is here).
> Also, on Mac it seems that there is some success with NPM v5.5.1
- [PQJS-178](https://jira.kp.org/browse/PQJS-178) Updating/Removing various dependencies within the lib. Most notably (Meaning they break the old project due to node versions backwards compatibility or other issues)...
    + Removing...
        * log-4js
        * properties-reader
        * python-shell
    + Upgrading...
        * Selenium to ^3.3.0 (currently at 3.6.0 which should be latest)
- [PQEAUTO-338](https://jira-fof.appl.kp.org/browse/PQEAUTO-338) Rewording outdated information in readme to better explain how to consume and and install the library. Also updating the supported browser versions and minimum requirements.
- [PQEAUTO-309](https://jira-fof.appl.kp.org/browse/PQEAUTO-309) [PQEAUTO-296](https://jira-fof.appl.kp.org/browse/PQEAUTO-296) Changing how we call the "modify ldap" methods by invoking the interrupts API 'modifyLDAP' endpoint instead of opening a connection

## [4.7.1] - 2018 May 30
### Changed
- [PQEAUTO-316](https://jira-fof.appl.kp.org/browse/PQEAUTO-316) Modifying the modifyLdapAttribute example from 4.7 (PQEAUTO-291) to now use the interrupts.getAllUserProperties method. This will ensure that we are passing the correct value to the modifyLdapAttribute when performing a delete operation.

## [4.7] - 2018 May 16
### Added
- [PQEAUTO-291](https://jira-fof.appl.kp.org/browse/PQEAUTO-291) Adding functionality to modify LDAP attributes using the interrupts API. Can now call method `iterrupts.modifyLdapAttribute(guid, operationType, attributeName, attributeValue, callback)`

### Changed
- [PQEAUTO-291](https://jira-fof.appl.kp.org/browse/PQEAUTO-291) Modified the error call back for all interrupts API methods to now return params as `response` and `error`. This setup more closely aligns to what is shown in the sample scripts as well as what is outlined in the docs which state "returns raw-response and json body".

## [4.6.3] - 2018 March 13
### Changed
- [PQJS-243](https://jira.kp.org/browse/PQJS-243) (signon team) Correcting HINT3 LDAP credentials that were previously added in 4.6.2

## [4.6.2] - 2018 Februray 20
### Added
- [PQJS-242](https://jira.kp.org/browse/PQJS-242) Adding HINT3 LDAP info as requested by signon team

## [4.6.1] - 2018 January 16
### Fixed
- [PQJS-237](https://jira.kp.org/browse/PQJS-237) QC Update was called multiple times therefore, multiple test run updates were made for scripts that only ran once.
- [PQJS-238](https://jira.kp.org/browse/PQJS-238) Fixing issue when qc dosent update unless it matched all test cases from allure.

## [4.6] - 2018 January 9
- [PQJS-225](https://jira.kp.org/browse/PQJS-225) Enhance our QC integration to now create test runs and write run comments containing errors.
    + [PQJS-209](https://jira.kp.org/browse/PQJS-209) Map QC work to test instance
    + [PQJS-228](https://jira.kp.org/browse/PQJS-228) Extract Data from Allure
    + [PQJS-229](https://jira.kp.org/browse/PQJS-229) Create Method for POSTing New Test Run
    + [PQJS-230](https://jira.kp.org/browse/PQJS-230) Create Method for PUTting New Test Run Status
    + [PQJS-206](https://jira.kp.org/browse/PQJS-206) QC Integration - Create Test Run

## [4.5.2] - 2017 December 20
### Changed
- [PQJS-233](https://jira.kp.org/browse/PQJS-233) Correcting DB Configs for various envs

## [4.5.1] - 2017 December 6
### Changed
- [PQJS-218](https://jira.kp.org/browse/PQJS-218) Correcting DB Connect strings for various enviroments.

## [4.5] - 2017 October 19
### Fixed
- [PQJS-210](https://jira.kp.org/browse/PQJS-210) go file updates to handle duplicate calls to the connSetup
- [PQJS-198](https://jira.kp.org/browse/PQJS-198) Removed the screenshot.take statement from "helper.redirectUrl" and "helper.clickRadioButton" functions

### Changed
- [PQJS-200](https://jira.kp.org/browse/PQJS-200) Creating config files including `npmignore` so that downstream projects can more quickly clone the library. This file will prevent certain files from being received including the kp theme file.

## [4.4] - 2017 August 22
### Added
- [PQJS-181](https://jira.kp.org/browse/PQJS-149) Added interrupts.js to our index. Testers can now interface with interrupts using `require('kp-webdriverjs-utils').interrupts` syntax
- [PQJS-183](https://jira.kp.org/browse/PQJS-183) Added ability to use inhouse (located in PTC) perfecto mobile grid for mobile automation testing. New field (location) was added to `driverconfig.properties`

### Changed
- [PQJS-149](https://jira.kp.org/browse/PQJS-149) Upped `grunt-mocha-test` package and from `^0.12.7` to `^0.13.2`
- [PQJS-147](https://jira.kp.org/browse/PQJS-147) | [PQJS-148](https://jira.kp.org/browse/PQJS-148) `helper.waitUntilVisible` now takes an extra (optional) param `message` which is the desired error message to show if the desired element does not show up on page within the desired timeout. e.g. `helper.waitUntilVisible([signOn.logoffMessage], "Log off confirmation text not found");`
- [PQJS-182](https://jira.kp.org/browse/PQJS-182) Documentation on `interrupts.js` was changed so that the class 'interrupts' will show up on the yuidoc. Additionally, interrupts is added to utils as module and api as a sub module (so old links to the /api/ portion of the docs will still work).
- [PQJS-172](https://jira.kp.org/browse/PQJS-172) Seperated qc calls to one file by moving them out of qcFilter so qcFilter is only for matching data. Added ES6 standard code in Qc files with a bit of clean up to the files.
- [PQJS-183](https://jira.kp.org/browse/PQJS-183) `driverconfig.properties` now has a new field for perfecto mobile automation called `location` which lets you denote which perfecto grid to use. Creation of perfectomobile driver now reads either of the 2 grid urls

### Fixed
- [PQJS-164](https://jira.kp.org/browse/PQJS-164) QC get call to get test cases only return 100 test cases at a time. So we used the "start-index" option in the header and created a loop to grab all the test cases under the test set id.
- [PQJS-149](https://jira.kp.org/browse/PQJS-149) Had an issue with `test.it.only` and `test.describe.only` not working with Mocha 3.x; this was due to our `grunt-mocha-test` package and has been fixed updating the version
- [PQJS-147](https://jira.kp.org/browse/PQJS-147) | [PQJS-148](https://jira.kp.org/browse/PQJS-148) Clarified error when calling sign off method so end-user can more clearly understand why/what failed during logOff() function call.
- [PQJS-168](https://jira.kp.org/browse/PQJS-168) Correcting yuidoc so that LDAP Utils (`ldapUtils`) appears as it's own class and it's no longer inside of data reader class.
- [PQJS-171](https://jira.kp.org/browse/PQJS-171) Retroactively dated the 4.3.1 release (date was previously missing in documentation)
- [PQJS-172](https://jira.kp.org/browse/PQJS-172) Fixed issues with the pagnation behavior of qc.
- [PQJS-180](https://jira.kp.org/browse/PQJS-180) Fixed how we consume `env.where` in ldapUtils so that we can now make it case insenstive when it's read.
- [PQJS-170](https://jira.kp.org/browse/PQJS-170) Fixed assertion in `verifyTitle` function in helper file to be expect(actual).to.contain(expected) instead of expect(expected).to.contain(actual)
- [PQJS-188](https://jira.kp.org/browse/PQJS-188) Added a `clear()` to our sign on page scripts to ensure that the form fields are empty before we start entering user ID and passwords.

## [4.3.1] - 2017 July 19
### Added
- [PQJS-86](https://jira.kp.org/browse/PQJS-86) Platform variable is now exported in `env.js` as 'platform'. This variable has always been present behind the scenes and is set automatically by our task runners, we are just now exposing it so testers can determine if this is a mobile run (perfecto options passed) or a desktop run (browser was called and opened)

### Changed
- [PQJS-163](https://jira.kp.org/browse/PQJS-163) Updated `"Db host"` for hint1, hint2, and dev3
    + hint1 from  `"host": "xjzxddb0002x.dta.kp.org"` to `"host": "xjzxiap0011x.dta.kp.org"`
    + hint2" from `"host": "xjzxddb0001x.dta.kp.org"` to `"host": "xjzxiap0021x.dta.kp.org"`
    + Wppdev3 from `"host": "xjzxddb0002x.dta.kp.org"` to `"host": "xjzxdap0031x.dta.kp.org"`
- Timeout variable changed in webdriver.js form `var seleniumtimeout = process.env['seleniumtimeout']` to `process.env['SELENIUMTIMEOUT']` to make it consistent with other varaibles
- Modified how variables are created in our spec files. Previously we would list each variable on a line with `var a = '123; var b = '456';`, now we have them so that we no longer declare `var` after the first variable to help group items in a cleaner way. e.g. `var a = '123', b = '456';`

## [4.3] - 2017 July 11
### Added
- [PQJS-134](https://jira.kp.org/browse/PQJS-134) Added wrapper methods and tests to intergrate with interrupts micro service.
    + Added `mrnToGuid` function to be used in conjuction with wrapper methods in case testers do not have the GUID for their current mrns. However, to use this method they need to run connSetup so it's highly suggested that they grab the guids and just use the RESTful microservice
    + Created `mrnToGuidParser` which can take an array of mrns and output an array of json objects containing the GUIDS of the mrns passed
- [PQJS-152](https://jira.kp.org/browse/PQJS-152) Added "Fixed" section for 4.2 and soon-to-be-4.3 (unreleased). Also added extra notes for unreleased (4.3) section.
- [PQJS-42](https://jira.kp.org/browse/PQJS-42) Added QC Integration (ALM REST API for 12.53) to JS framework
    + Test statuses
        * Allure Pass/Fail test cases marked Pass/Fail in QC
        * Allure Broken test cases marked Not Completed
        * Skipped test cases, `test.it.skip`, marked Blocked in QC
    + QC Run capability handled from jenkins directly via a parameter
    + In order to consume this, testers must modify their shell files in their ci/ directory

### Removed

### Changed
- [PQJS-157](https://jira.kp.org/browse/PQJS-157) Changed `"host": "xjzxddb0001x.dta.kp.org"` to `"host": "xjzxdap0042x.dta.kp.org"` for wppdev4 DB connection string.
- [PQJS-134](https://jira.kp.org/browse/PQJS-134) Modified package.json by adding request package.
- Phantom JS dependency is now modified to `"phantomjs-prebuilt": "^2.1.14"` (previously `"phantomjs": "~1.9.18"`) as suggested by phantom js github and npm pages.
- [PQJS-122](https://jira.kp.org/browse/PQJS-122) Added a cap to the allure version to `^1.5.0` so that people with Java (JRE) 1.7 can still generate allure reports

### Fixed
- [PQJS-151](https://jira.kp.org/browse/PQJS-151) Adding glob to package.json since it was previsouly missing
- [PQJS-124](https://jira.kp.org/browse/PQJS-124) Added Georgia (GGA) region to our all regions array in env.js since it was previously missing

### Known-Issues
- Perfecto mobile iOS device will sometimes have issues deleting cookies due to the OS of the device (less than 10.2). This is not a problem with our framework as the tests can delete cookies on most iOS handsets.

## [4.2] - 2017 May 10
### Added
- [PQJS-48](https://jira.kp.org/browse/PQJS-48) Added code so we handle RWD proxy picker with our AEM proxy pciker function in helper
- [PQJS-65](https://jira.kp.org/browse/PQJS-65) Added a new test file as a sample of how you can manage multiple tets for both iOS and Android as well as clear the cookies.
- [PQJS-79](https://jira.kp.org/browse/PQJS-79) Added links and status buttons of the pqlib smoke jobs in the readme

### Removed
- [PQJS-65](https://jira.kp.org/browse/PQJS-65) removed `driver.manage().deleteAllCookies();` from mobile and desktop browser initializations.

### Changed
- [PQJS-69](https://jira.kp.org/browse/PQJS-69) Updated mocha version to ^3.2.0
- [PQJS-65](https://jira.kp.org/browse/PQJS-65) Go file was modified to remove no hang up executions for mobile tests.
- [PQJS-72](https://jira.kp.org/browse/PQJS-72) Removed using locators in screenshot desc in helper.js
- [PQJS-104](https://jira.kp.org/browse/PQJS-104) Added `env.seleniumtimeout` to the Sign on methods. This will make sure the "staleness of element" code will only wait for the time in the selenium-wait

### Fixed
- [PQJS-48](https://jira.kp.org/browse/PQJS-48) - Perfecto- "selectOptionFromDropDown" function in helper doesn't work for mobile execution when using it for RWD proxy picker.
- [PQJS-65](https://jira.kp.org/browse/PQJS-65) - delete cookies not working on perfecto
- [PQJS-72](https://jira.kp.org/browse/PQJS-72) - Test script failure result summary does not match with test case
- [PQJS-104](https://jira.kp.org/browse/PQJS-104) - [SPIKE] After signon, My Health page wait is for few seconds

### Known-Issues
- Perfecto mobile iOS device will sometimes have issues deleting cookies due to the OS of the device (less than 10.2). This is not a problem with our framework as the tests can delete cookies on most iOS handsets.

## [4.1.1] - 2017 Mar 28
### Changed
- [PQJS-73](https://jira.kp.org/browse/PQJS-73) HINT3 header signon now uses new AEM form. Corrected sign on code so now all envs are using those locators.

### Fixed
- [PQJS-71](https://jira.kp.org/browse/PQJS-71) - Needed to add env into job name during creation in groovy file.

## [4.1] - 2017 Mar 24
### Changed
- [PQJS-57](https://jira.kp.org/browse/PQJS-57), Contextual sign on URL now points directly to AEM instead of portal
    + OLD: `/health/care/signon` NEW: `/sign-on.html#/signon`
- [PQJS-62](https://jira.kp.org/browse/PQJS-62), Adding '@smoke' tag to add framework smoke jobs
    + OLD: `@spinner` NEW: `@smoke`
    + Modified ci groovy file to now run our smoke suites on most of our lower envs.
- [PQJS-67](https://jira.kp.org/browse/PQJS-67), Adding feature to `redirectUrl` function in helper to hanlde spanish url's

### Fixed
- [PQJS-57](https://jira.kp.org/browse/PQJS-57) - Contextual sign on URL is incorrect, pointing to portal instead of AEM. Changing this to AEM removed a dependency on portal redirect and F5
- [PQJS-62](https://jira.kp.org/browse/PQJS-62) - Adding '@smoke' tag for framework smoke tests and adding smoke tests for each of our hint and dev with greping @smoke

### Known-Issues
- [PQJS-48](https://jira.kp.org/browse/PQJS-48) - `selectOptionFromDropDown` doesn't work in Perfecto mobile with RWD Proxy Picker
- [PQJS-55](https://jira.kp.org/browse/PQJS-55) - Platform is not exported with `env.js`
    + A work around is in place
- [PQJS-58](https://jira.kp.org/browse/PQJS-58) - Dashboard Jenkins Job is Failing.
    + We do not believe this to be related to our framework code
- [PQJS-65](https://jira.kp.org/browse/PQJS-65) - Delete cookies not working on perfecto
    + This is most likely due to the fact that `driver().manage().deleteAllCookies()` must be called in different places for iOS and Android.

## [4.0] - 2017 Mar 14
### Added
- Re added the reporter options of junit and tap
- Added support for the screenshots (`screenshot.js`) for allure when using new reporters
- Added environments for March release.
- Adding Basic Requirements section in README
- Added Proxy picker function in helper for new proxy picker design
- Database support for wppdev3 environment
- LDAP Support for wppdev3, hint1, hqa, dev10, hint10, hqa10
- `assertIsDsiplayed()` added to `helper.js`

### Changed
- Updated allurereporter.js function `takeScreenshot` to use `screenshot.js`
- Updated mrn's for sample test (`signon_spec.js`)
- Modify sample groovy to have correct setup (projects will need to modify their groovy to match this)
- Handled Contextual Sign on. Now home (AEM), contextual (formerly 'portal'), Contextual sign on are in place.
- Changed type from portal to home for AEM Home page sign on
- Changed type from aem to contextual for 'portal' page sign on
- Updated README to reflect recent changes.
- Removed screenshots in `signonpage.js` and functions (redirectUrl,verifyTitle,clickRadioButton) in `helper.js`
- Merged publishers function in groovy file
- Regex added to ignore "/" in the test names for screenshots
- Hosts for hint1 database config
    + <code> "hint1": {
        OLD "host": "xlzsddb0010x.lvdc.kp.org",
        NEW "host": "xjzxddb0002x.dta.kp.org",</code>
- Host for hqa database config
    + <code>"hqa": {
        OLD "host": "xlzsddb0030x.lvdc.kp.org",
        NEW "host": "xjzxddb0002x.dta.kp.org",</code>
- Java dependency updated to version 0.7.1 from ^0.6.1

### Known-Issues
- `test.it.only` cannot be used when selecting `reporter=mocha-multi` in properties file.
> use either `mocha-allure-reporter` or `tap` reporter options
- `waitUntilVisible` method will sometimes throw "element not found in cache" bug

## [3.4] - 2016 Dec 6
### Changed
- Added sign on header locator and updated verify page and sign on form after sign on button clicked. So that we can support both Header sign on and Contextual Sign On.

## [3.3.1] - 2016 Oct 28
### Changed
- moved java dependency back into package and out of go
- commented out require ibm_db while searching out long term optimzation


## [3.3] - 2016 Oct 28
### Added
- added db connection params for DEV10, HINT10, HQA10
- take screenshot added to `waitUntilVisible` in `helper.js`
- `assertNotPresent` method now available in `helper.js`
- `assertNotDisplayed` method now available in `helper.js`
- config info to CPM DSN7 has been added to `dbconfig.json`
- `ibm_db` has been added to package.json to support the new files.
- unit test for CPM DSN7 added and tagged as smoke suite
- wppdev4,hint2,hqab config for db and ldap

### Removed
- removing takeScreenshot from `helper.js` as it's causing scripts to hang and take over 1000 screenshots.
- removing console.log from allure.takeScreenshot as it prints asynchronously from when the screenshot is actually captured

### Changed
- 'aem' url in our `data/environments.json` now points to /health/care/signon instead of /sign-on.html
- Moved `ibm_db`, `java`, and `ldapjs` packages out of `package.json` and into `go` to help speed up Jenkins jobs

## [3.2] - 2016 Sep 15
### Added
- allure-commandline dependency
- region picker (modal popup) method added to `helper.js`
- unit tests for region picker in `unit/helper.spec`
- `assertUrlContains` method added to `helper.js`

### Changed
- version in package.json and yuidoc now set to 3.2.0
- hqab database host has been changed from 0030x to 0010x following change made by Louis Staggs
- documentation for region picker now reads southern colorado as CS instead of CO

## [3.1] - 2016 Aug 11
### Added
- Added native mocha reporter option and fixed generate allure command default.
- A sample project has been created under sample folder under test
- Yuidocs to our projects so we can share formal documentation with end users on our [server](http://pzxdcc0092.cdbt.pldc.kp.org/kplib).
> Documentation will always be 'latest and greatest' version which can be seen in top right corner of hosted site
- `yuidocjs` added to our package.json
- KP Theme added for Yuidocs, <b>kptheme/</b>, contains necessary KP logos and formatting.
- Custom build yuidoc config file, `yuidoc.json`, created for documentation
> To create documentation use `node_modules/.bin/yuidoc`

### Changed
- Renamed `localYuidoc.json` to since we now only need 1 config file.
- Set version number of library to 3.1
- Modified allure spec to unit test the the allureReporter.js
- Re-structrued the folder structure under test and pages folder
- `gitignore` now includes line to ignore the locally generated yuidoc <b>./libdoc/</b>
- `selectOptionFromDropDown ` method in `helper.js` now only looks for an option that contains the key (partial match) instead of an exact match

### Removed
- Audit log functionality has been removed
- removed rwd signon option as rwd signon has been merged with aem

### Known-Issues
- Java library is not working on most windows machines without a proper setup, plese follow the instructions on the website for the package, [node java windwos install instructions](https://www.npmjs.com/package/java#installation-windows)

## [3.0.1] - 2016 May 26
### Fixed
- Correct go to include the missing help line for `dbSetup`

## [3.0] - 2016 May 16
### Added
- Added `filterUsers` function for projects to use to filter on "AND" conditions either by key/value pair or by tags or both -- all values must match. e.g. passing mulitple tags, "tag1", "tag2", "tag3"; data must have all 3 tags.
> OLD WAY: `users = users.listByTag(data.sample, ['tag','array']);`
<br>
> NEW WAY: `users = users.filterUsers(data.sample,'default,colorado',{"region": "COL","group": "Signon"});`
- Added index.js for projects to use files exposed to them by just calling the name rather than knowing the path<br>
> `OLD WAY: env = require('kp-webdriverjs-utils/support/env');`
<br>
> `NEW WAY: env = require('kp-webdriverjs-utils').env;`
- chai-as-promised lib is added
- adding dbUtils in lib which helps with connection to the dev20 database and to execute a sql statement

### Changed
- Reduced parameter to signon function from 3 to 2 to dynamically populate the the url and still provide all different type of Signon
- Moved all support and utils to lib folder for better tracking

### Removed
- Removed screenshot.js to have project to use allureReporter.js screenshot

### Known-Issues
- added global variable - not working as expected. need testing


## [2.2] - 2016 Apr 21
### Added
- Contextual sign On provided with the "kpSignOn" function based on if you pass in the url parameter.
- Redirect within the kp portal has been provided with 'redirectUrl' function in helper

### Changed
- Selenium version is updated to v2.52.0.
- Node >0.12.0  npm >3.0.0 supports latest selenium version upgrade, so project team needs to upgrade node & npm
- Signon has been modified to handle sign on for rwd, aem, portal all via calling function "kpSignOn"
- Clean up capabilities.json to reflect our current needs for driver capabilities
- Framework level `data/environments.json` no longer contains the links to all environemnts. Projects needing this will have to create their own json file with the necessary data in it.

### Removed
- Removed the find by tag and find by group in user.js
- `support/env.js` will no longer export `config`. Projects using the concept of `env.config` will have to create their own local variables pointing to their environments.json file.

## [2.1] - 2016 Apr 13
### Added
- dev20 has been added to `data/environments.json`.
- Logic for staleness of sigon has been added to `pages/common/signon_page.js`.
- `test.beforeEach` added to `support/env.js`
- A change log, `CHANGES.md`, has been added to track all the work we've done and are currently doing on our framework.

### Changed
- Removed unnecessary console.log form `pages/common/sigon_page.js`.
- `test.afterEach` in `support/env.js` has been modified to more clearly print <b>PASS/FAIL</b> state of every test. <b>PASS / FAIL</b> will now print in GREEN or RED respectively.
- `driverconfig.properties` will no only use GREP instead of grepinclude / grepexclude
- `./go help` has been cleaned up and no longer prints options which are no longer valid.
- `README.md` has been claned up to reflect the changes made to `go` and `webdriver.js`. The exact parts that were changed were the grep instructions and the reporting instructions.
- `webdriver.js` now has an option to auto ammend the <i>resultsdirsuffix</i> if one was not supplied when running tests on Grid CI.

### Fixed
- Staleness of signon has been fixed by adding new code to `pages/common/signon_page.js`.
- Running lib test would throw a syntax error caused by go perfecto exection lines.

### Removed
- grepinclude and grepexclude have been removed from `driverconfig.properties`.
- `webdriver.js` no longer has the options to rerun failed test cases, also, grepinclude/grepexclude have been removed. These pieces were removed because they were not working as expected. We will revisit them to see if we can add them into a future release.

## [2.0] - 2016 Apr 5
### Added
- `test.afterEach` has been added to `support/env.js.`
- `webdriver.js` file has been created which now contains all logic formerly in `Gruntfile.js`.

### Changed
- Modified `go` that it can now execute commands when called from project path; this allows for users who consume this lib to use functions from node_modules/.
- Clean `go clean()` will now run `npm install` after it has cleaned the work space.
- Post commit hook will now run a fetch -p, prune, to delete any stale branches.
- `./go test` will no longer pass --force by default.
- Browser executions using `./go test` will now print execution logs to terminal and no longer save them to a file. (allure reporting is unaffected by this change).
- `Gruntfile.js` has been stripped down of most logic. All the logic has been movied to `webdriver.js`.

### Fixed
- `runtestsuite` bug in which it was calling allure batch file (allure-commandline/bin/allure.bat) on Mac OSX machines.
- Calling `./go setup()` or `./go setupWindows`, requirements() will no longer copy go, runtestsuite, driverconfig.properties, or Gruntfile into the project workspace.

### Removed
- `ActionItems.md` has been deleted.

## 1.0 - 2016 Mar 23
### Added
- Unit test for checking users bytag functionality.
- Clean will no clean *.log files.
- New sign on test added for verifying we can read just the env from properties file (env.where).
- Users.js will now be able to look for local users.

### Changed
- Post commit hook will now fetch to make sure we haven't divered and make sure that you can create hooks even for projects embedded with developers.

### Removed
- Pre-Commit, Prepare Commit Message, and Pre-Push hooks.

[Unreleased]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?sourceBranch=refs%2Fheads%2Fdevelopment&targetRepoId=1037
[5.0.2]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv5.0.1&sourceBranch=refs%2Ftags%2Fv5.0.2&targetRepoId=1037
[5.0.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv5.0&sourceBranch=refs%2Ftags%2Fv5.0.1&targetRepoId=1037
[5.0]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.7.1&sourceBranch=refs%2Ftags%2Fv5.0&targetRepoId=1037
[4.7.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.7&sourceBranch=refs%2Ftags%2Fv4.7.1&targetRepoId=1037
[4.7]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.6.3&sourceBranch=refs%2Ftags%2Fv4.7&targetRepoId=1037
[4.6.3]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.6.2&sourceBranch=refs%2Ftags%2Fv4.6.3&targetRepoId=1037
[4.6.2]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.6.1&sourceBranch=refs%2Ftags%2Fv4.6.2&targetRepoId=1037
[4.6.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.6&sourceBranch=refs%2Ftags%2Fv4.6.1&targetRepoId=1037
[4.6]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.5.2&sourceBranch=refs%2Ftags%2Fv4.6&targetRepoId=1037
[4.5.2]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.5.1&sourceBranch=refs%2Ftags%2Fv4.5.2&targetRepoId=1037
[4.5.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.5&sourceBranch=refs%2Ftags%2Fv4.5.1&targetRepoId=1037
[4.5]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.4&sourceBranch=refs%2Ftags%2Fv4.5&targetRepoId=1037
[4.4]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.3.1&sourceBranch=refs%2Ftags%2Fv4.4&targetRepoId=1037
[4.3.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.3&sourceBranch=refs%2Ftags%2Fv4.3.1&targetRepoId=1037
[4.3]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.2&sourceBranch=refs%2Ftags%2Fv4.3&targetRepoId=1037
[4.2]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.1.1&sourceBranch=refs%2Ftags%2Fv4.2&targetRepoId=1037
[4.1.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.1&sourceBranch=refs%2Ftags%2Fv4.1.1&targetRepoId=1037
[4.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv4.0&sourceBranch=refs%2Ftags%2Fv4.1&targetRepoId=1037
[4.0]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.4&sourceBranch=refs%2Ftags%2Fv4.0&targetRepoId=1037
[3.4]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.3.1&sourceBranch=refs%2Ftags%2Fv3.4&targetRepoId=1037
[3.3.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.3&sourceBranch=refs%2Ftags%2Fv3.3.1&targetRepoId=1037
[3.3]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.2&sourceBranch=refs%2Ftags%2Fv3.3&targetRepoId=1037
[3.2]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.1&sourceBranch=refs%2Ftags%2Fv3.2&targetRepoId=1037
[3.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.0.1&sourceBranch=refs%2Ftags%2Fv3.1&targetRepoId=1037
[3.0.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv3.0&sourceBranch=refs%2Ftags%2Fv3.0.1&targetRepoId=1037
[3.0]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv2.2&sourceBranch=refs%2Ftags%2Fv3.0&targetRepoId=1037
[2.2]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv2.1&sourceBranch=refs%2Ftags%2Fv2.2&targetRepoId=1037
[2.1]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv2.0&sourceBranch=refs%2Ftags%2Fv2.1&targetRepoId=1037
[2.0]: https://stash.kp.org/projects/PQE/repos/kp-webdriverjs-utils/compare/diff?targetBranch=refs%2Ftags%2Fv1.0&sourceBranch=refs%2Ftags%2Fv2.0&targetRepoId=1037
