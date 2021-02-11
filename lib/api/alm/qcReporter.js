var fs = require('fs'),
    path = require('path'),
    xml2js = require('xml2js'),
    glob = require('glob'),
    _ = require('underscore-node');

var parser = xml2js.Parser();

var myPath = 'allure-results*/*.xml';

var builder = new xml2js.Builder();


var fileparsed = 0;
var numOfFiles = 0;

var result_array_test_name = [];
var result_array_time = [];
var result_array_test_status = [];
var result_array_stacktrace = [];
var no_qcid_test = [];

module.exports = function() {
  return {
    redoreport: function (callback) {
      // Get all xml files names in the myPath location
      glob(myPath, function (er, files) {
        numOfFiles = files.length;
        console.log('Number of XML files found: ', numOfFiles);
        // For each xml file name
        _.each(files, function (xmlfile) {
          // Read data in each xml file,
          fs.readFile(xmlfile, function (err, data) {
            // console.log(xmlfile)
            // convert xml file to json object
            parser.parseString(data, function (err, result) {
              // console.log(fileparsed,numOfFiles)
              fileparsed++;
              // Get describe name
              var describe = result['ns2:test-suite'].name[0].replace('Root Suite ', '');
              // var counter =0;
              var startTime = result['ns2:test-suite'].$.start;
              // console.log('start time: !!!!!!!!!!'+ startTime)
              // get all test cases in the describe
              var testcases = result['ns2:test-suite']['test-cases'][0]['test-case'];
              // For each testcase in describe
              _.each(testcases, function (testcase) {
                // If test name has qc in it
                if (testcase.name[0].includes('QC')) {
                  // Get QC ID from test name and get test status
                  result_array_test_name.push(testcase.name[0].match(/(\bQC\S+\d\b)/ig)[0].replace('QC', ''));
                  result_array_test_status.push(testcase.$.status);
                  result_array_time.push(testcase.$.start);
                  if (testcase.$.status === 'broken' || testcase.$.status === 'failed') {
                    // If test status failed or broken then get the stack trace and push it to stacktrace array else send the message in else
                    result_array_stacktrace.push(testcase.failure[0]['stack-trace']);
                  } else {
                    result_array_stacktrace.push('status is neither broken or failed');
                  }
                } else {
                  // If testname dosent have a QCID push to the error array.
                  console.log('We found a test which has no qc id test name: ', testcase.name[0]);
                  no_qcid_test.push(testcase.name[0]);
                }
              });
            });
            // If all the xml files are parsed
            console.log('Number of XML files parsed: ', fileparsed);
            // For eac
            if (numOfFiles === fileparsed) {
              // If any tests were found without any qcid
              if (no_qcid_test.length !== 0) {
                fs.writeFile('./target/qcUpdateWarning.txt', 'We found test which has no qc id in test name: ' + no_qcid_test, function (err) {
                  if (err) {
                    return console.log(err);
                  }
                  console.log('The qcUpdateWarning file was saved!');
                });
              }
              console.log('Reports Parsing Complete');
              callback(result_array_time, result_array_test_name, result_array_test_status, result_array_stacktrace);
            }
          });
        });
      });
    }
  };
};