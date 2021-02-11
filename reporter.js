var fs = require('fs')

var path = require('path')
var xml2js = require('xml2js');
var parser = xml2js.Parser();
var glob = require('glob');
var myPath = "allure-results*/*.xml";
//var jsxml = require("node-jsxml");
var _ = require('underscore-node')

var builder = new xml2js.Builder();


var fileparsed = 0;
var numOfFiles;

module.exports = function () {
  return {
    redoreport: function (grunt, callback) {
      //get all xml files names in the myPath location
      glob(myPath, function (er, files) {
        var numOfFiles = files.length;
        //for each xml file name
        _.each(files,
         function (xmlfile) {
          //read data in each xml file,
          fs.readFile(xmlfile, function (err, data) {
            console.log(xmlfile)
            //convert xml file to json object
            parser.parseString(data, function (err, result) {

              fileparsed = fileparsed + 1;
              //get describe name
              var describe = result['ns2:test-suite']['name'][0].replace("Root Suite ", "");

              //get all test cases in the describe
              var testcases = result['ns2:test-suite']['test-cases'][0]['test-case'];
              //for each testcase in describe
              _.each(testcases, function (testcase) {

                //get testcase name
                var testName = testcase['name'][0];
                //create screenshot path in target folder
                var scpath = './target/screenshots/**/' + testName + '/*.png';
                var attachmentCounter = 0;
                //getting all screenshots for the testcase
                glob(scpath, function (er, files) {
                  //for each screenshot for the test
                  _.each(files, function (file) {
                    //get file size
                    var sizeOfImage = fs.statSync(file).size

                    //copy the file to results folder and add "-attachment" to it
                    var newImgName = file.replace(".png", "-attachment.png").substring(file.replace(".png", "-attachment.png").lastIndexOf('/') + 1)
                    fs.rename(file, './allure-results/' + newImgName, function (err) {
                      if (err) {
                        console.log("moving image into allure-results failed ");
                        throw err;
                      }

                    })
                    //fs.createReadStream(file).pipe(fs.createWriteStream('./allure-results/' + newImgName));//replace firefox in this with process.argv[2]
                    //if its the first attachment to the test then it needs to create the json in a different way
                    if (attachmentCounter == 0) {
                      var obj = [{
                        'attachment': [{
                          '$': {
                            title: newImgName,
                            source: newImgName,
                            type: "image/png",
                            size: sizeOfImage
                          }
                        }]
                      }]
                      //update json to include the attachments
                      testcase['attachments'] = obj;
                      //convert json to xml
                      var xml = builder.buildObject(result);
                      //saving file after converting to xml
                      fs.writeFile(xmlfile, xml);
                    } else { //if its not the first attachment to the test then it needs to create the json in a different way and add it in.
                      var x = {
                        '$': {
                          title: newImgName,
                          source: newImgName,
                          type: "image/png",
                          size: sizeOfImage
                        }
                      }
                      //update json to include the attachments
                      testcase['attachments'][0]['attachment'].push(x);
                      //convert json to xml
                      var xml = builder.buildObject(result);
                      //saving file after converting to xml
                      fs.writeFile(xmlfile, xml);
                    }
                    attachmentCounter++;
                  });
                });
              });
            });
          });
        });
      });
      if (numOfFiles = fileparsed) {
        callback('done')
      }
    }
  }

}