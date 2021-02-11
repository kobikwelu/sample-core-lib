var report = require('./qcReporter.js')(),
  filter = require('./qcFilter.js')(),
  request = require('request'),
  fs = require('fs'),
  _ = require('underscore-node'),
  config = require('../../../data/almConfig.json');

const almhost = config.prod; // Has to be manually changed to prod v test. process.env can't be used because it's undefined until we get into the function call (ln 25)
const loginOptions = {
  method: 'GET',
  url: 'http://' + almhost + '/api/authentication/sign-in',
  headers: {
    authorization: 'Basic ' + config.alm_auth,
    shouldKeepAlive: 'true'
  }
};

var updateFailure = [];

const logoutOption = {
  method: 'GET',
  url: 'http://' + almhost + '/api/authentication/sign-out'
};

function qcCalls() {
  // Calling allure report parser to get the qcids from the tests and their status
  report.redoreport(function (start_time, allure_qcid, allure_status, allure_stacktrace) {
    console.log('ALLURE QCID: ' + allure_qcid);
    // If the returned qcid array and status array lenght are the same and the lenghts do not equal 0
    if (allure_qcid.length === allure_status.length && allure_status.length !== 0) {
      firstCall(function (session, totalTests, totalCalls) {
        console.log('Total testinstances found in QC: ' + totalTests + ' Number of calls needed to get all testinstances: ' + totalCalls);
        var matched_status = [];
        var matched_stacktrace = [];
        var qcid_update = [];
        var uniqueid_update = [];
        var reduced = [];
        var counterB = 0;
        /*
        After we know the total test cases and we know how many times we need to make the call to
        get all the test cases we go into the below loop. The loop below will loop until either all
        the test cases have been retrived and matched or until we find all the QCID in allure_qcid
        */
        for (var i = 0; i < totalCalls; i++) {
          index = (i * 100) + 1;
          /* For each call needed create a new request option and get all the instances for that options then match them */
          createOptions(session, index, function (getOptions) {
            getTestInstances(getOptions, function (qc_qcid, qc_uniqueid) {
              console.log(i + ' Set of QCID', qc_qcid);
              filter.matchData(allure_qcid, allure_status, qc_qcid, qc_uniqueid, matched_status, qcid_update, uniqueid_update, allure_stacktrace, matched_stacktrace, function (matched_status, qcid_update, uniqueid_update, matched_stacktrace) {
                counterB++;
                /* Quit the for loop if we found all the qcid to update(qc_update) or if we made all the calls we needed (totalCalls == counterB) */
                if (qcid_update.length === allure_qcid.length && totalCalls === counterB) {
                  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                  console.log('got all recoreds matched');
                  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                  updateStatus(matched_status, qcid_update, uniqueid_update, matched_stacktrace, start_time, function () {
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('QC UPDATE COMPLETE-Warning File Saved');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                  });
                } else if (totalCalls === counterB && qcid_update.length != allure_qcid.length) {
                  //below code only happens if we cant find some of the qcids from allure in QC and we have checked all the testcases in qc.
                  console.log('LAST CALL TO QC', 'we cant find some of the qcids from allure in QC');
                  fs.exists('./target/qcUpdateError.txt', function (exists) {
                    if (exists) {
                      console.log(_.difference(qcid_update, allure_qcid))
                      fs.appendFile('./target/qcUpdateError.txt', '\n' + 'We found tests in project report which are not in QC, Matched IDs: ' + qcid_update, function (err) {
                        if (err) {
                          return console.log(err);
                        }
                        console.log('The qcUpdateWarning file was saved!');
                        console.log(matched_status, qcid_update, uniqueid_update);
                        updateStatus(matched_status, qcid_update, uniqueid_update, matched_stacktrace, start_time, function () {
                          console.log('QC UPDATE COMPLETE END OF RUN');
                        });
                      });
                    } else {
                      console.log(_.difference(qcid_update, allure_qcid))
                      fs.writeFile('./target/qcUpdateError.txt', 'We found tests in project report which are not in QC, Matched IDs: ' + qcid_update, function (err) {
                        if (err) {
                          return console.log(err);
                        }
                        console.log('The qcUpdateWarning file was saved!');
                        console.log(matched_status, qcid_update, uniqueid_update);
                        updateStatus(matched_status, qcid_update, uniqueid_update, matched_stacktrace, start_time, function () {
                          console.log('QC UPDATE COMPLETE END OF RUN');
                        });
                      });
                    }
                  });
                }
              });
            });
          });
        }
      });
    } else { // Xml parsing failed
      console.log('Issue parsing the allure xml');
    }
  });
}

function updateStatus(testStatus, qcid, uniqueId, stacktrace, start_time, callback) {
  request(loginOptions, function (err, res, body) {
    if (res.statusCode === 200) {
      var status = '';
      var totalStatus = testStatus.length;
      var counter = 0;
      var comment = '';
      // After loging into QC, for each status create the update option
      testStatus.forEach(function (currentStatus, index) {
        counter++;
        if (currentStatus === 'broken') {
          status = 'Not Completed';
          comment = stacktrace[index].toString().replace(/\s\W/g, '');
        } else if (currentStatus === 'failed') {
          status = 'Failed';
          comment = stacktrace[index].toString().replace(/\s\W/g, '');
        } else if (currentStatus === 'passed') {
          status = 'Passed';
          comment = 'No Errors'
        } else if (currentStatus === 'pending') {
          status = 'Blocked';
          comment = 'TC Skipped in Allure'
        } else status = 'No Run';

        var updateOptions = {
          method: 'PUT',
          url: 'http://' + almhost + '/rest/domains/HP/projects/KPOrg_Migration/test-instances/' + uniqueId[index],
          headers: {
            'cookie': res.headers['set-cookie'],
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'accept': 'application/json'
          },
          'body': {
            Fields: [{
              Name: 'status',
              values: [{
                value: status
              }]
            }]
          },
          json: true
        };

        // var runComment = '<html><body> \n<div align="left" style="min-height:9pt"></div> \n<div align="left" style="min-height:9pt">\n<font face="Arial" color="#000080"><span style="font-size:8pt"><b>Alberto Aguilar &lt;alberto aguilar&gt;, 12/6/2017:</b></span></font>\n<font face="Arial"><span style="font-size:8pt">' + stacktrace + '</span></font>\n</div>  \n</body></html>';
        var dateTimeStamp = new Date(parseInt(start_time[index]));
        var date = dateTimeStamp.toLocaleDateString() + '-' + dateTimeStamp.toLocaleTimeString();

        var runName = 'JENKINS_' + date;
        var newRunOptions = {
          method: 'POST',
          url: 'http://' + almhost + '/rest/domains/HP/projects/KPOrg_Migration/runs/',
          headers: {
            'cookie': res.headers['set-cookie'],
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'accept': 'application/json'
          },
          'body': {
            Fields: [{
              Name: 'test-id',
              values: [{
                value: qcid[index]
              }]
            }, {
              Name: 'owner',
              values: [{
                value: 'alberto aguilar'
              }]
            }, {
              Name: 'comments',
              values: [{
                value: comment
              }]
            }, {
              Name: 'subtype-id',
              values: [{
                value: 'hp.qc.run.MANUAL'
              }]
            }, {
              Name: 'cycle-id',
              values: [{
                value: process.env.QC_TEST_SET_ID
              }]
            }, {
              Name: 'test-instance',
              values: [{
                value: '1'
              }]
            }, {
              Name: 'name',
              values: [{
                value: runName
              }]
            }, {
              Name: 'testcycl-id',
              values: [{
                value: uniqueId[index]
              }]
            }, {
              Name: 'status',
              values: [{
                value: 'Not Completed'
              }]
            }, {
              Name: 'duration',
              values: [{
                value: '2'
              }]
            }],
            Type: 'run',
            'children-count': 0
          },
          json: true
        };

        if (currentStatus !== undefined) {
          if (status === 'Not Completed') {
            request(updateOptions, function (err, res, body) {
              if (res.statusCode === 200) {
                // THIS UPDATE SUCCESSFUL WILL BE INTERIM STEP NOW
                console.log('SUCCESSFULLY CREATED QUICK RUN FOR BROKEN TEST: ' + qcid[index]);
              } else {
                // Update for the qcid failed
                console.log('Failed to create quick run for ' + qcid[index] + '. Failed with: ', err);
                updateFailure.push(qcid[index]);
              }
            }); // End update current instance
          }
          createTestRun(newRunOptions, status, (status, runid) => {
            // The runid is the id of the newly created test run
            // we then use the run id to PUT an update to the run status
            var updateRunOptions = {
              method: 'PUT',
              url: 'http://' + almhost + '/rest/domains/HP/projects/KPOrg_Migration/runs/' + runid,
              headers: {
                'cookie': res.headers['set-cookie'],
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'accept': 'application/json'
              },
              'body': {
                Fields: [{
                  Name: 'status',
                  values: [{
                    value: status
                  }]
                }]
              },
              json: true
            };

            // Now we take the options above and use it for final status updates
            // this could probably be moved to an external method like the inital update
            request(updateRunOptions, (err, res, body) => {
              if (res.statusCode === 200) {
                console.log('UPDATE SUCCESSFUL TEST#: ' + qcid[index]);
              } else {
                console.log('Run update for Allure QC ID ' + qcid[index] + ' Failed', err);
                updateFailure.push('Run update failed for qcid ' + qcid[index] + ' runid ' + runid);
              }
            });
          });
        }
        if (totalStatus === counter && updateFailure !== undefined) {
          fs.exists('./target/qcUpdateError.txt', function (exists) {
            if (exists) {
              fs.appendFile('./target/qcUpdateError.txt', '\n' + 'Updates to these QCID failed during update call: ' + updateFailure.length, function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log('The qcUpdateWarning file was saved!');
                callback(uniqueId, testStatus, qcid);
              });
            } else {
              fs.writeFile('./target/qcUpdateError.txt', 'Updates to these QCID failed during update call: ' + updateFailure.length, function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log('The qcUpdateWarning file was saved!');
                callback(uniqueId, testStatus, qcid);
              });
            }
          })
          callback();
        }

      }); // End for each

    } // End if 200 status
    else {
      // Login to qc failed.
      console.log('LOGIN TO QC FAILED' + response.body);
      callback();
    }
  }); // End request(loginOptions...
} // End update function

function logout() {
  request(logoutOption, function (err, res) {
    if (res.statusCode === 200) {
      console.log('logged out');
    } else {
      console.log(response.body);
    }
  });
}

function firstCall(callback) {
  request(loginOptions, function (error, response, body) {
    if (response.statusCode === 200) {
      // If login successfull create options for getting qcid for given test-set
      var fistGet = {
        method: 'GET',
        url: 'http://' + almhost + '/rest/domains/HP/projects/KPOrg_Migration/test-instances',
        qs: {
          query: '{contains-test-set.id[' + process.env.QC_TEST_SET_ID + ']}',
          fields: 'id,test-id'
        },
        headers: {
          'cookie': response.headers['set-cookie'],
          'cache-control': 'no-cache',
          accept: 'application/json',
          authorization: 'Basic ' + config.alm_auth
        }
      };
      // Find out how many times we need to make get calls to get all test cases by getting the total number of testcases and dividing by a 100 and always rounding up ex: 150/100 = 2
      request(fistGet, function (err, res, body) {
        if (res.statusCode === 200) {
          totalTests = JSON.parse(res.body).TotalResults;
          totalCalls = Math.ceil(totalTests / 100);
          // Return the data
          callback(response, totalTests, totalCalls);
        } else {
          // Initial call to testset failed
          console.log('FIRST CALL TO TESTSET FAILED' + response.body);
          callback();
        }
      });
    } else {
      // Login to qc failed.
      console.log('LOGIN TO QC FAILED' + response.body);
      callback();
    }
  });
}

function createOptions(response, index, callback) {
  // console.log(index)
  var getOptions = {
    method: 'GET',
    url: 'http://' + almhost + '/rest/domains/HP/projects/KPOrg_Migration/test-instances',
    qs: {
      query: '{contains-test-set.id[' + process.env.QC_TEST_SET_ID + ']}',
      fields: 'id,test-id',
      'start-index': index
    },
    headers: {
      'cookie': response.headers['set-cookie'],
      'cache-control': 'no-cache',
      accept: 'application/json',
      authorization: 'Basic ' + config.alm_auth
    }
  };
  callback(getOptions);
}

function getTestInstances(getOptions, callback) {
  var temp_uniqueID = [];
  var temp_testID = [];
  var x = 0;
  request(getOptions, function (error, response, body) {
    if (response.statusCode == 200) {
      // If successful then get all the test cases for the test setid
      var tc = JSON.parse(response.body);
      var testCases = tc["entities"];
      _.each(testCases, function (testCase) {
        // For each test case get the QCID and unique ID and store it in an array
        var testCaseFields = testCase['Fields'];
        _.each(testCaseFields, function (eachField) {
          if (eachField.Name === 'id') {
            // Push all uniqueId's to the array above.
            temp_uniqueID.push(eachField['values'][0].value);
          }
          if (eachField.Name === 'test-id') {
            // Push all QCID's to the array above.
            temp_testID.push(eachField['values'][0].value);
          }
        });
        x++;
        if (x === testCases.length) {
          callback(temp_testID, temp_uniqueID);
        }
      });
    } else {
      // Call to get test cases on index failed
      console.log('CALL TO TESTSET ON INDEX' + index + 'FAILED' + response.body);
      callback();
    }
  });
}

function createTestRun(newRunOptions, status, callback) {
  request(newRunOptions, (err, res, body) => {
    if (res.statusCode === 201) {
      // If successful then give back the run ID
      callback(status, res.body.Fields[18].values[0].value); // This is the run ID and we're passing the status through from previous state setting
    } else {
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$\nERROR\nSTATUS CODE: " + res.statusCode + "\n$$$$$$$$$$$$$$$$$$$$$$$$$");
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$\nRUN OPTIONS\n$$$$$$$$$$$$$$$$$$$$$$$$$");
      updateFailure.push('Create Run Failure with runOptions' + JSON.stringify(newRunOptions))
      console.log(JSON.stringify(newRunOptions));
      // console.log(JSON.stringify(res));
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$\nRESPONSE BODY\n$$$$$$$$$$$$$$$$$$$$$$$$$");
      console.log(JSON.stringify(body));
    }
  });
}

module.exports = qcCalls;