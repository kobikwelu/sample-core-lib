# This is a test core-lib

This repo is intended to be distributed as a base framework for JS Automation Projects users. This will be done by consuming this library via a `package.json`.

## Basic System Requirements
Node version >=6 and <9<br>
NPM version is above 3.0, however NPM 5.0.0 - 6.0.1 will prune dependencies it thinks are not needed
> However, Mac seems to have some success with NPM v5.5.1

Java version is 1.7 or 1.8 for connections
> JDK 9 not supported

Python v 2.7.x
C++ Compilers: (mac)xcode (win)Visual Studio Express (linux)devtoolset 4


## Supported Browser Verions:

### Local Browser versions:
Firefox version: 60 (At the time of update)
Chrome version: Latest* (We always pull latest chromedriver)
Safari Version: 11 (At the time of update)

### Grid Browser versions:
win7-"ie-grid": ie11,ff47.0.1,ch5

## Setup
For new projects there is a setup file which will get you started please get in contact with framework folks.
`npm install` will install dependencies for your project if your package.json has kp-webdriverjs-utils included in it.
`./go setupWindows` will configure the environment and should install dependencies for Windows OS (7++)
Try to run a test after setup; if it fails, go to section for install
For additional project setup details, please refer the below link in sharepoint. Use cs\NUID and Nuid password to view the files.
[CDS - JS Automation Documentation](https://sites.sp.kp.org/teams/dto/APOQ/pqe/_layouts/15/start.aspx#/Shared%20Documents/Forms/Summary%20View.aspx?RootFolder=%2Fteams%2Fdto%2FAPOQ%2Fpqe%2FShared%20Documents%2FCDS%20%2D%20JS%20Automation%20Documentation&FolderCTID=0x01200070A01282C67F4845824D8D1517B399A9&View=%7B5D79F3A2%2D22DD%2D4F01%2DA1AA%2D4A39FD95CF1C%7D)

## INSTALL
For project consumption, add kp-weberiverjs-utils to your package.json and run `npm install`.

## RUN TEST

### Config Properties File
A config file, driverconfig.properties, is included to easilily manage file as below before execution. Below is a break down of the properties file.

**mochatestspecs**=This property is <b>required</b> and is the folder where your test scripts reside. e.g. test/common/signon_spec.js
**grep**=Field which uses keywords within `test.describe` or `test.it` blocks to search for test(s) and <b>include</b> them in the execution. e.g. FindDoc location|My Health Menu
**environment**=The single environment you wish to run your suite against. e.g dev1/hint1 etc
**seleniumtimeout**=Numerical value for the timeout in milliseconds (ms). e.g. 5000
**location**=The location of the perfecto grid you want to use. `inhouse` is the one in PTC; `remote` is the one hosted offsite.
**iosdevices**=Id of the Perfecto iphone device
**iosdevicenames**=Any name that we want the allure report to show/be called. e.g. iPhone 5
**androiddevices**=Id of the Android Perfecto device
**androiddevicenames**=Any name that we want the allure report to show/be called. e.g. Google Nexus
**perfectousername**=Perfecto user id
**perfectopassword**=Perfecto Password
> <b>NOTE</b> Do **NOT** commit your credentials

**regions**=Can use to filter for a specific users in test or pass in `All` to get an array of all the regions
  **reporter**= the different types of reports to genearte from tests, options: mocha-multi/tap/ mocha-allure-reporter
**browsers**=Comma seperated field for the browser(s) you wish to run on. e.g. firefox,chrome,safari,firefox-grid,chrome-grid
**browserwidth**=1000
**browserheight**=1000


### Running the tests
 `./go test` will also run the tests using the values from driverconfig.properties.

Use `./go help` for a full list of wrapper commands.

## RUN TEST in GRID
By default, test will be executed locally.
To run on grid : Modify the driverconfig.properties file as above with browsers type as ie-grid-firefox,ie-grid-chrome,ie-grid-ie,firefox-grid,chrome-grid
Once modified, execute `./go test`

## LDAP/Database Connection
To use LDAP/ODBC/DB2 connections you will need to do the basic setup which includes having kp framework base files including package.json.
By default, only ODBC (Java) dependencies are installed. For other connections read on..
Run `./go connSetup` to install all dependencies needed and allow you to connect to ldap and db2.
To execute db queries use the function `executeSql` provided in `lib/dbUtils`
To execute ldap queries use the function `performLdapAction` provided in `lib/ldapUtils`
To execute DB2 queries you need to use the function `cpmSyncQuery` provided in `lib/dbUtils`

### LDAP Errors
Additional setup might be required on a Mac running OSX or later. If the following error is encountered, please follow these steps.
Error: `To open "this java application" you need to install the legacy Java SE 6 runtime`
Fix: Install legacy Java 6 runtime for OS X from [Apple support page](https://support.apple.com/kb/DL1572?locale=en_US)
>Be sure to install javaforosx (above) and make sure JDK is installed.

## Report
After Execution, allure results and reports are generated in respective folders. e.g. allure-results-firefox, allure-reports-firefox.

All the results are archived in archive-allure-results folder.
The folders inside archive-allure-results folder will get automatically deleted after 99 minutes (this happens at test runtime)
### Opening Reports
To open allure reports from command line enter either of the following commands
`allure report open --report-dir=allure-reports-firefox`
`allure report open -o allure-reports-firefox`
